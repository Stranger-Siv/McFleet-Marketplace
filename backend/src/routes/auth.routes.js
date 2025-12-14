import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { protect, authorizeRoles } from '../middlewares/auth.middleware.js';
import SellerRequest from '../models/SellerRequest.js';
import User from '../models/User.js';
import PriceRange from '../models/PriceRange.js';
import ItemListing from '../models/ItemListing.js';
import Order from '../models/Order.js';
import Transaction from '../models/Transaction.js';
import Settings from '../models/Settings.js';
import Dispute from '../models/Dispute.js';
import Rating from '../models/Rating.js';
import AuditLog from '../models/AuditLog.js';
import Category from '../models/Category.js';
import Survival from '../models/Survival.js';
// import User from '../models/User.js';
import { logAdminAction } from '../utils/auditLogger.js';
import { maskOrderData, maskListingData, maskUserData } from '../utils/dataMasking.js';

const router = express.Router();

router.get('/discord', passport.authenticate('discord', { session: false }));

router.get('/discord/callback',
  passport.authenticate('discord', { session: false, failureRedirect: '/' }),
  (req, res) => {
    try {
      const token = jwt.sign(
        {
          userId: req.user._id,
          role: req.user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Sanitize and validate FRONTEND_URL
      let frontendUrl = process.env.FRONTEND_URL || '';

      // Remove any whitespace, newlines, and special characters that shouldn't be in URL
      frontendUrl = frontendUrl.trim().split(/[\s|]+/)[0]; // Take first part if multiple values separated by | or space

      // Remove trailing slash
      frontendUrl = frontendUrl.replace(/\/$/, '');

      // Validate URL format
      if (!frontendUrl || (!frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://'))) {
        console.error('Invalid FRONTEND_URL:', process.env.FRONTEND_URL);
        // Fallback to a default or return error
        return res.status(500).json({
          message: 'Server configuration error: Invalid FRONTEND_URL. Please contact administrator.'
        });
      }

      // Construct redirect URL
      const redirectUrl = `${frontendUrl}/auth/success?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Discord callback error:', error);
      res.status(500).json({ message: 'Authentication failed. Please try again.' });
    }
  }
);

router.get('/me', protect, async (req, res) => {
  try {
    // Check if user has a seller request (get most recent one)
    // First check for pending, then get most recent of any status
    let sellerRequest = await SellerRequest.findOne({
      user: req.user.userId,
      status: 'pending'
    });

    // If no pending request, get the most recent request of any status
    if (!sellerRequest) {
      sellerRequest = await SellerRequest.findOne({ user: req.user.userId })
        .sort({ updatedAt: -1 });
    }

    const userData = {
      ...req.user,
      sellerRequest: sellerRequest ? {
        status: sellerRequest.status,
        createdAt: sellerRequest.createdAt,
        updatedAt: sellerRequest.updatedAt
      } : null
    };

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/seller/test', protect, authorizeRoles('seller'), (req, res) => {
  res.json({
    success: true,
    message: 'Seller access granted'
  });
});

router.get('/seller/transactions', protect, authorizeRoles('seller'), async (req, res) => {
  try {
    const transactions = await Transaction.find({ seller: req.user.userId })
      .select('_id order itemPrice sellerPayout status createdAt')
      .populate({
        path: 'order',
        select: '_id',
        populate: {
          path: 'listing',
          select: 'title itemName'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/seller/commission', protect, authorizeRoles('seller'), async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const commissionPercent = settings?.commissionPercent || 20;

    res.json({
      success: true,
      commissionPercent
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/seller/earnings', protect, authorizeRoles('seller'), async (req, res) => {
  try {
    const transactions = await Transaction.find({ seller: req.user.userId });

    const totalOrders = transactions.length;
    const totalEarned = transactions.reduce((sum, t) => sum + t.sellerPayout, 0);
    const paidOut = transactions
      .filter(t => t.status === 'paid_out')
      .reduce((sum, t) => sum + t.sellerPayout, 0);
    const pendingPayout = transactions
      .filter(t => t.status === 'recorded')
      .reduce((sum, t) => sum + t.sellerPayout, 0);

    res.json({
      success: true,
      summary: {
        totalOrders,
        totalEarned,
        paidOut,
        pendingPayout
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/seller/listings', protect, authorizeRoles('seller'), async (req, res) => {
  try {
    // Sellers can see all their listings including disabled ones
    const listings = await ItemListing.find({ seller: req.user.userId })
      .select('_id title price stock description status createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      listings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/seller/orders', protect, authorizeRoles('seller'), async (req, res) => {
  try {
    // Fetch orders where the logged-in user is the seller
    const orders = await Order.find({ seller: req.user.userId })
      .populate('listing', 'title itemName category stock')
      .populate('buyer', 'discordUsername discordId')
      .populate('middleman', 'discordUsername discordId')
      .sort({ createdAt: -1 })
      .select('_id status listing buyer middleman quantity unitPrice totalPrice commissionAmount sellerReceivable createdAt updatedAt');

    // Mask sensitive data for seller role (buyer Discord details hidden)
    const maskedOrders = orders.map(order =>
      maskOrderData(order.toObject(), req.user.role, req.user.userId)
    );

    res.json({
      success: true,
      orders: maskedOrders
    });
  } catch (error) {
    console.error('Seller orders fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/seller-request', protect, async (req, res) => {
  try {
    // Check for pending request
    const pendingRequest = await SellerRequest.findOne({
      user: req.user.userId,
      status: 'pending'
    });

    if (pendingRequest) {
      return res.status(400).json({ message: 'Request already submitted' });
    }

    // Check for rejected request within last 24 hours
    const rejectedRequest = await SellerRequest.findOne({
      user: req.user.userId,
      status: 'rejected'
    }).sort({ updatedAt: -1 }); // Get most recent rejected request

    if (rejectedRequest) {
      const rejectionTime = new Date(rejectedRequest.updatedAt);
      const now = new Date();
      const hoursSinceRejection = (now - rejectionTime) / (1000 * 60 * 60);

      if (hoursSinceRejection < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceRejection);
        return res.status(400).json({
          message: `You can resubmit a seller request after 24 hours. Please wait ${hoursRemaining} more hour(s).`,
          hoursRemaining: hoursRemaining,
          canResubmitAt: new Date(rejectionTime.getTime() + 24 * 60 * 60 * 1000)
        });
      }
    }

    await SellerRequest.create({ user: req.user.userId });

    res.json({
      success: true,
      message: 'Seller request submitted'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/seller-requests', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const requests = await SellerRequest.find().populate('user');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/seller-requests/:id/approve', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const request = await SellerRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already finalized' });
    }

    request.status = 'approved';
    await request.save();

    await User.findByIdAndUpdate(request.user, { role: 'seller' });

    await logAdminAction({
      adminId: req.user.userId,
      action: 'APPROVE_SELLER',
      targetType: 'user',
      targetId: request.user
    });

    res.json({
      success: true,
      message: 'Seller request approved'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/seller-requests/:id/reject', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const request = await SellerRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already finalized' });
    }

    request.status = 'rejected';
    await request.save();

    await logAdminAction({
      adminId: req.user.userId,
      action: 'REJECT_SELLER',
      targetType: 'user',
      targetId: request.user,
      note: `Rejected seller request for user`
    });

    res.json({
      success: true,
      message: 'Seller request rejected'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/price-ranges', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { itemName, category, survival, minPrice, maxPrice } = req.body;

    const priceRange = await PriceRange.create({
      itemName,
      category,
      survival,
      minPrice,
      maxPrice,
      createdBy: req.user.userId
    });

    res.json(priceRange);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/price-ranges', async (req, res) => {
  try {
    const priceRanges = await PriceRange.find({ active: true });
    res.json(priceRanges);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/listings', async (req, res) => {
  try {
    const { survival, category, itemName } = req.query;

    // Only show active listings to buyers (exclude disabled_by_admin and removed)
    const query = { status: 'active' };

    if (survival) {
      query.survival = survival;
    }

    if (category) {
      query.category = category;
    }

    if (itemName) {
      query.itemName = itemName;
    }

    const listings = await ItemListing.find(query).populate('seller', 'discordUsername discordId totalDeals totalRatings averageRating');

    // Mask seller Discord details for public/buyer access (no authenticated user)
    // Public access = buyer role masking (no Discord details)
    const maskedListings = listings.map(listing => {
      const listingObj = listing.toObject();
      if (listingObj.seller) {
        listingObj.seller = {
          _id: listingObj.seller._id,
          // Include rating info (public data)
          totalDeals: listingObj.seller.totalDeals || 0,
          totalRatings: listingObj.seller.totalRatings || 0,
          averageRating: listingObj.seller.averageRating || 0
        };
      }
      return listingObj;
    });

    res.json({
      success: true,
      listings: maskedListings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/listings/:listingId', protect, async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await ItemListing.findById(listingId).populate('seller', 'discordUsername discordId totalDeals totalRatings averageRating');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Block access to disabled or removed listings
    if (listing.status !== 'active') {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Mask seller Discord details based on requester role
    const maskedListing = maskListingData(listing.toObject(), req.user.role, req.user.userId);

    res.json({
      success: true,
      listing: maskedListing
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/listings', protect, authorizeRoles('seller'), async (req, res) => {
  try {
    const { title, itemName, category, survival, price, stock, description } = req.body;

    // Validate required fields
    if (!title || !itemName || !category || !survival || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate and ensure price is a number
    const priceValue = typeof price === 'string' ? parseFloat(price) : Number(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    // Validate stock
    const stockValue = stock !== undefined ? parseInt(stock) : 1;
    if (!Number.isInteger(stockValue) || stockValue < 1) {
      return res.status(400).json({ message: 'Stock must be a positive integer (minimum 1)' });
    }

    // Validate category exists and is active
    const categoryDoc = await Category.findOne({ name: category, active: true });
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Invalid or inactive category' });
    }

    // Validate survival exists and is active
    const survivalDoc = await Survival.findOne({ name: survival, active: true });
    if (!survivalDoc) {
      return res.status(400).json({ message: 'Invalid or inactive survival/world' });
    }

    const listing = await ItemListing.create({
      title,
      itemName,
      category,
      survival,
      price: priceValue,
      stock: stockValue,
      description: description ? description.trim() : '',
      seller: req.user.userId,
      status: 'active'
    });

    res.json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('Listing creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/listings/:listingId/stock', protect, authorizeRoles('seller'), async (req, res) => {
  try {
    const { listingId } = req.params;
    const { stock } = req.body;

    // Validate stock
    if (stock === undefined || stock === null) {
      return res.status(400).json({ message: 'Stock value is required' });
    }

    const newStock = parseInt(stock);
    if (!Number.isInteger(newStock) || newStock < 0) {
      return res.status(400).json({ message: 'Stock must be a non-negative integer (minimum 0)' });
    }

    const listing = await ItemListing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Verify seller owns this listing
    if (listing.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only update your own listings' });
    }

    // Calculate how many units have been sold (reserved in orders)
    const reservedOrders = await Order.find({
      listing: listingId,
      status: { $nin: ['completed', 'cancelled'] }
    });

    const reservedQuantity = reservedOrders.reduce((sum, order) => sum + (order.quantity || 0), 0);

    // Prevent reducing stock below already reserved quantity
    if (newStock < reservedQuantity) {
      return res.status(400).json({
        message: `Cannot reduce stock below ${reservedQuantity} (already reserved in active orders)`
      });
    }

    const oldStock = listing.stock;
    listing.stock = newStock;

    // Reactivate listing if it was sold and new stock is added
    if (listing.status === 'sold' && newStock > 0) {
      listing.status = 'active';
    }

    // Mark as sold if stock reaches zero
    if (newStock === 0) {
      listing.status = 'sold';
    }

    await listing.save();

    res.json({
      success: true,
      listing,
      message: `Stock updated from ${oldStock} to ${newStock}`
    });
  } catch (error) {
    console.error('Stock update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/orders', protect, authorizeRoles('user', 'seller'), async (req, res) => {
  try {
    const { listingId, quantity } = req.body;

    // Validate quantity
    const orderQuantity = quantity !== undefined ? parseInt(quantity) : 1;
    if (!Number.isInteger(orderQuantity) || orderQuantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive integer (minimum 1)' });
    }

    // Use transaction to ensure atomic stock reservation
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Lock the listing document for update (atomic operation)
      const listing = await ItemListing.findById(listingId).session(session);

      if (!listing) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Listing not found' });
      }

      // Block orders for non-active listings (including disabled_by_admin)
      if (listing.status !== 'active') {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: listing.status === 'disabled_by_admin'
            ? 'This listing has been removed by admin'
            : 'Listing not available'
        });
      }

      if (listing.seller.toString() === req.user.userId) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Cannot order your own listing' });
      }

      // Check stock availability
      if (!listing.stock || listing.stock < orderQuantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Insufficient stock. Available: ${listing.stock || 0}, Requested: ${orderQuantity}`
        });
      }

      // Calculate prices
      const unitPrice = listing.price;
      const totalPrice = unitPrice * orderQuantity;

      // Reserve stock (reduce available stock)
      listing.stock = listing.stock - orderQuantity;

      // Update listing status if stock reaches zero
      if (listing.stock === 0) {
        listing.status = 'sold';
      }

      await listing.save({ session });

      // Create order with quantity and pricing
      const order = new Order({
        buyer: req.user.userId,
        seller: listing.seller,
        listing: listing._id,
        quantity: orderQuantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        status: 'pending_payment'
      });

      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.json({
        success: true,
        order
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Transaction error:', error);
      // Re-throw with more context
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  } catch (error) {
    console.error('Order creation error:', error);
    // Provide more detailed error message
    const errorMessage = error.message || 'Server error';
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.get('/buyer/orders', protect, authorizeRoles('user'), async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.userId })
      .populate('listing', 'title price stock')
      .populate('seller', 'discordUsername discordId totalDeals totalRatings averageRating')
      .populate('middleman', 'discordUsername discordId')
      .sort({ createdAt: -1 })
      .select('_id status listing seller middleman quantity unitPrice totalPrice commissionAmount sellerReceivable createdAt updatedAt');

    // Mask sensitive data for buyer role
    const maskedOrders = orders.map(order =>
      maskOrderData(order.toObject(), req.user.role, req.user.userId)
    );

    res.json({
      success: true,
      orders: maskedOrders
    });
  } catch (error) {
    console.error('Buyer orders fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orders/:orderId', protect, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('buyer', 'discordUsername discordId')
      .populate('seller', 'discordUsername discordId totalDeals totalRatings averageRating')
      .populate('middleman', 'discordUsername discordId')
      .populate('listing');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Access control: Allow only buyer, seller, assigned middleman, or admin
    const isBuyer = order.buyer?._id?.toString() === req.user.userId;
    const isSeller = order.seller?._id?.toString() === req.user.userId;
    const isMiddleman = order.middleman && order.middleman._id?.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isMiddleman && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Check for rating
    const rating = await Rating.findOne({ order: orderId });

    // Check for active dispute
    const dispute = await Dispute.findOne({
      order: orderId,
      status: 'open'
    }).populate('raisedBy', 'discordUsername');

    // Mask sensitive data based on requester role
    const maskedOrder = maskOrderData(order.toObject(), req.user.role, req.user.userId);

    // Include rating if exists
    if (rating) {
      maskedOrder.rating = {
        rating: rating.rating,
        createdAt: rating.createdAt
      };
    }

    // Add dispute info if exists (masked based on role)
    if (dispute) {
      maskedOrder.dispute = {
        _id: dispute._id,
        reason: dispute.reason,
        description: dispute.description,
        status: dispute.status,
        createdAt: dispute.createdAt,
        raisedBy: maskUserData(dispute.raisedBy.toObject(), req.user.role, {
          isOwnData: dispute.raisedBy._id.toString() === req.user.userId
        })
      };
    }

    res.json({
      success: true,
      order: maskedOrder
    });
  } catch (error) {
    console.error('Order detail fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/orders/:orderId/assign-middleman', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { orderId } = req.params;
    const { middlemanId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Block middleman assignment on disputed orders
    if (order.status === 'disputed') {
      return res.status(400).json({ message: 'Cannot assign middleman to a disputed order' });
    }

    // Block middleman assignment on disputed orders
    if (order.status === 'disputed') {
      return res.status(400).json({ message: 'Cannot assign middleman to a disputed order' });
    }

    if (order.status !== 'paid' && order.status !== 'pending_payment') {
      return res.status(400).json({ message: 'Order not eligible for middleman assignment' });
    }

    const middleman = await User.findById(middlemanId);
    if (!middleman) {
      return res.status(404).json({ message: 'Middleman not found' });
    }

    order.middleman = middlemanId;
    await order.save();

    await logAdminAction({
      adminId: req.user.userId,
      action: 'ASSIGN_MIDDLEMAN',
      targetType: 'order',
      targetId: orderId
    });

    res.json({
      success: true,
      message: 'Middleman assigned'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/users/:userId/make-middleman', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot assign admin as middleman' });
    }

    user.role = 'middleman';
    await user.save();

    await logAdminAction({
      adminId: req.user.userId,
      action: 'MAKE_MIDDLEMAN',
      targetType: 'user',
      targetId: userId,
      note: `Assigned middleman role to user`
    });

    res.json({
      success: true,
      message: 'Middleman added'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/users/:userId/remove-middleman', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = 'user';
    await user.save();

    await logAdminAction({
      adminId: req.user.userId,
      action: 'REMOVE_MIDDLEMAN',
      targetType: 'user',
      targetId: userId,
      note: `Removed middleman role from user`
    });

    res.json({
      success: true,
      message: 'Middleman removed'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find()
      .select('_id discordUsername role banned createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orders', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    // Filter by status if provided, otherwise get all non-completed orders
    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: 'completed' };
    }

    const orders = await Order.find(query)
      .populate('buyer', 'discordUsername discordId')
      .populate('seller', 'discordUsername discordId')
      .populate('middleman', 'discordUsername discordId')
      .populate('listing', 'title price')
      .sort({ createdAt: -1 });

    // Admin can see all data - no masking needed, but we'll still use the function for consistency
    const maskedOrders = orders.map(order =>
      maskOrderData(order.toObject(), req.user.role, req.user.userId)
    );

    res.json({
      success: true,
      orders: maskedOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users/middlemen', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const middlemen = await User.find({
      role: 'middleman',
      banned: false
    }).select('_id discordUsername reputation');

    res.json({
      success: true,
      middlemen
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/orders/:orderId/collect', protect, authorizeRoles('middleman'), async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.middleman?.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not assigned to this order' });
    }

    // Block actions on disputed orders
    if (order.status === 'disputed') {
      return res.status(400).json({ message: 'Cannot perform actions on a disputed order' });
    }

    // Block actions on disputed orders
    if (order.status === 'disputed') {
      return res.status(400).json({ message: 'Cannot perform actions on a disputed order' });
    }

    if (order.status !== 'paid') {
      return res.status(400).json({ message: 'Order must be paid before collection' });
    }

    order.status = 'item_collected';
    await order.save();

    res.json({
      success: true,
      message: 'Item collected'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/orders/:orderId/deliver', protect, authorizeRoles('middleman'), async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.middleman?.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not assigned to this order' });
    }

    // Block actions on disputed orders
    if (order.status === 'disputed') {
      return res.status(400).json({ message: 'Cannot perform actions on a disputed order' });
    }

    // Block actions on disputed orders
    if (order.status === 'disputed') {
      return res.status(400).json({ message: 'Cannot perform actions on a disputed order' });
    }

    // Block actions on disputed orders
    if (order.status === 'disputed') {
      return res.status(400).json({ message: 'Cannot perform actions on a disputed order' });
    }

    if (order.status !== 'item_collected') {
      return res.status(400).json({ message: 'Item must be collected before delivery' });
    }

    order.status = 'item_delivered';
    await order.save();

    res.json({
      success: true,
      message: 'Item delivered'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/middleman/orders', protect, authorizeRoles('middleman'), async (req, res) => {
  try {
    const orders = await Order.find({ middleman: req.user.userId })
      .populate('buyer', 'discordUsername discordId')
      .populate('seller', 'discordUsername discordId')
      .populate('listing', 'title itemName')
      .sort({ createdAt: -1 })
      .select('_id status buyer seller listing quantity unitPrice totalPrice commissionAmount sellerReceivable createdAt updatedAt');

    // Middleman can see buyer and seller Discord details
    const maskedOrders = orders.map(order =>
      maskOrderData(order.toObject(), req.user.role, req.user.userId)
    );

    res.json({
      success: true,
      orders: maskedOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/orders/:orderId/mark-paid', protect, authorizeRoles('middleman'), async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.middleman?.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not assigned to this order' });
    }

    // Block actions on disputed orders
    if (order.status === 'disputed') {
      return res.status(400).json({ message: 'Cannot perform actions on a disputed order' });
    }

    if (order.status !== 'pending_payment') {
      return res.status(400).json({ message: 'Order already paid or invalid state' });
    }

    order.status = 'paid';
    await order.save();

    res.json({
      success: true,
      message: 'Order marked as paid'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/orders/:orderId/complete', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('listing');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Block completion of disputed orders (admin must resolve dispute first)
    if (order.status === 'disputed') {
      return res.status(400).json({ message: 'Cannot complete a disputed order. Resolve the dispute first.' });
    }

    if (order.status !== 'item_delivered') {
      return res.status(400).json({ message: 'Order not ready for completion' });
    }

    const settings = await Settings.findOne();
    const commissionPercent = settings?.commissionPercent || 20;

    // Use order's totalPrice (already calculated with quantity)
    const totalPrice = order.totalPrice || (order.unitPrice * order.quantity);
    const commissionAmount = (totalPrice * commissionPercent) / 100;
    const sellerPayout = totalPrice - commissionAmount;

    // Update order with calculated values
    order.commissionAmount = commissionAmount;
    order.sellerReceivable = sellerPayout;
    order.status = 'completed';
    await order.save();

    // Increment seller's totalDeals
    await User.findByIdAndUpdate(order.seller, {
      $inc: { totalDeals: 1 }
    });

    const transaction = await Transaction.create({
      order: order._id,
      buyer: order.buyer,
      seller: order.seller,
      middleman: order.middleman,
      itemPrice: totalPrice, // Store total order price
      commissionPercent,
      commissionAmount,
      sellerPayout,
      paymentMethod: 'UPI'
    });

    // Note: Stock was already reserved/reduced when order was created
    // On completion, stock is permanently consumed (no restoration needed)

    await logAdminAction({
      adminId: req.user.userId,
      action: 'COMPLETE_ORDER',
      targetType: 'order',
      targetId: orderId
    });

    res.json({
      success: true,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/transactions', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('buyer', 'discordUsername')
      .populate('seller', 'discordUsername')
      .populate('middleman', 'discordUsername')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/transactions/summary', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find();

    const totalTransactions = transactions.length;
    const totalRevenue = transactions.reduce((sum, t) => sum + t.itemPrice, 0);
    const totalCommission = transactions.reduce((sum, t) => sum + t.commissionAmount, 0);
    const totalSellerPayout = transactions.reduce((sum, t) => sum + t.sellerPayout, 0);
    const pendingSellerPayout = transactions
      .filter(t => t.status === 'recorded')
      .reduce((sum, t) => sum + t.sellerPayout, 0);

    res.json({
      success: true,
      summary: {
        totalTransactions,
        totalRevenue,
        totalCommission,
        totalSellerPayout,
        pendingSellerPayout
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/settings', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    let settings = await Settings.findOne();

    // If no settings exist, return default
    if (!settings) {
      return res.json({
        success: true,
        settings: {
          commissionPercent: 20
        }
      });
    }

    res.json({
      success: true,
      settings: {
        commissionPercent: settings.commissionPercent
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== RATING APIs ====================
router.post('/orders/:orderId/rate', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating } = req.body;

    // Validate rating
    if (!rating || typeof rating !== 'number') {
      return res.status(400).json({ message: 'Rating is required and must be a number' });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify buyer is the requester
    if (order.buyer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only the buyer can rate this order' });
    }

    // Check order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed orders' });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({ order: orderId });
    if (existingRating) {
      return res.status(400).json({ message: 'This order has already been rated' });
    }

    // Create rating
    const newRating = await Rating.create({
      order: orderId,
      seller: order.seller,
      buyer: req.user.userId,
      rating: rating
    });

    // Update seller metrics
    const seller = await User.findById(order.seller);
    if (seller) {
      const newTotalRatings = (seller.totalRatings || 0) + 1;
      const newRatingSum = (seller.ratingSum || 0) + rating;
      const newAverageRating = Math.round((newRatingSum / newTotalRatings) * 10) / 10; // Round to 1 decimal

      await User.findByIdAndUpdate(order.seller, {
        totalRatings: newTotalRatings,
        ratingSum: newRatingSum,
        averageRating: newAverageRating
      });
    }

    res.json({
      success: true,
      rating: newRating
    });
  } catch (error) {
    console.error('Rating creation error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This order has already been rated' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/sellers/:sellerId/rating', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const seller = await User.findById(sellerId).select('totalDeals totalRatings averageRating');

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json({
      success: true,
      rating: {
        averageRating: seller.averageRating || 0,
        totalRatings: seller.totalRatings || 0,
        totalDeals: seller.totalDeals || 0
      }
    });
  } catch (error) {
    console.error('Get seller rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orders/:orderId/rating', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const rating = await Rating.findOne({ order: orderId });

    res.json({
      success: true,
      rating: rating || null
    });
  } catch (error) {
    console.error('Get order rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/settings/commission', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { commissionPercent } = req.body;

    if (typeof commissionPercent !== 'number') {
      return res.status(400).json({ message: 'Commission must be a number' });
    }

    if (commissionPercent < 5 || commissionPercent > 40) {
      return res.status(400).json({ message: 'Commission must be between 5 and 40' });
    }

    let settings = await Settings.findOne();

    const oldCommission = settings?.commissionPercent;

    if (settings) {
      settings.commissionPercent = commissionPercent;
      await settings.save();
    } else {
      settings = await Settings.create({ commissionPercent });
    }

    await logAdminAction({
      adminId: req.user.userId,
      action: 'UPDATE_COMMISSION',
      targetType: 'settings',
      targetId: settings._id,
      note: oldCommission
        ? `Updated commission from ${oldCommission}% to ${commissionPercent}%`
        : `Set commission to ${commissionPercent}%`
    });

    res.json({
      success: true,
      commissionPercent: settings.commissionPercent
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== CATEGORIES APIs ====================
// Public endpoint for sellers to get active categories
router.get('/settings/categories', async (req, res) => {
  try {
    const categories = await Category.find({ active: true })
      .select('name')
      .sort({ name: 1 });

    res.json({
      success: true,
      categories: categories.map(cat => cat.name)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all categories
router.get('/settings/categories/all', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('createdBy', 'discordUsername')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create category
router.post('/settings/categories', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      createdBy: req.user.userId
    });

    await logAdminAction({
      adminId: req.user.userId,
      action: 'CREATE_CATEGORY',
      targetType: 'category',
      targetId: category._id,
      note: `Created category: ${category.name}`
    });

    res.json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update category
router.put('/settings/categories/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const existingCategory = await Category.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    const oldName = category.name;
    category.name = name.trim();
    await category.save();

    await logAdminAction({
      adminId: req.user.userId,
      action: 'UPDATE_CATEGORY',
      targetType: 'category',
      targetId: category._id,
      note: `Renamed category from "${oldName}" to "${category.name}"`
    });

    res.json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Disable/Enable category
router.post('/settings/categories/:id/disable', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.active = !category.active;
    await category.save();

    await logAdminAction({
      adminId: req.user.userId,
      action: category.active ? 'ENABLE_CATEGORY' : 'DISABLE_CATEGORY',
      targetType: 'category',
      targetId: category._id,
      note: `${category.active ? 'Enabled' : 'Disabled'} category: ${category.name}`
    });

    res.json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SURVIVALS APIs ====================
// Public endpoint for sellers to get active survivals
router.get('/settings/survivals', async (req, res) => {
  try {
    const survivals = await Survival.find({ active: true })
      .select('name')
      .sort({ name: 1 });

    res.json({
      success: true,
      survivals: survivals.map(sur => sur.name)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all survivals
router.get('/settings/survivals/all', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const survivals = await Survival.find()
      .populate('createdBy', 'discordUsername')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      survivals
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create survival
router.post('/settings/survivals', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Survival name is required' });
    }

    const existingSurvival = await Survival.findOne({ name: name.trim() });
    if (existingSurvival) {
      return res.status(400).json({ message: 'Survival already exists' });
    }

    const survival = await Survival.create({
      name: name.trim(),
      createdBy: req.user.userId
    });

    await logAdminAction({
      adminId: req.user.userId,
      action: 'CREATE_SURVIVAL',
      targetType: 'survival',
      targetId: survival._id,
      note: `Created survival: ${survival.name}`
    });

    res.json({
      success: true,
      survival
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update survival
router.put('/settings/survivals/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Survival name is required' });
    }

    const survival = await Survival.findById(id);
    if (!survival) {
      return res.status(404).json({ message: 'Survival not found' });
    }

    const existingSurvival = await Survival.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existingSurvival) {
      return res.status(400).json({ message: 'Survival name already exists' });
    }

    const oldName = survival.name;
    survival.name = name.trim();
    await survival.save();

    await logAdminAction({
      adminId: req.user.userId,
      action: 'UPDATE_SURVIVAL',
      targetType: 'survival',
      targetId: survival._id,
      note: `Renamed survival from "${oldName}" to "${survival.name}"`
    });

    res.json({
      success: true,
      survival
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Disable/Enable survival
router.post('/settings/survivals/:id/disable', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const survival = await Survival.findById(id);
    if (!survival) {
      return res.status(404).json({ message: 'Survival not found' });
    }

    survival.active = !survival.active;
    await survival.save();

    await logAdminAction({
      adminId: req.user.userId,
      action: survival.active ? 'ENABLE_SURVIVAL' : 'DISABLE_SURVIVAL',
      targetType: 'survival',
      targetId: survival._id,
      note: `${survival.active ? 'Enabled' : 'Disabled'} survival: ${survival.name}`
    });

    res.json({
      success: true,
      survival
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/transactions/:transactionId/mark-paid', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'recorded') {
      return res.status(400).json({ message: 'Payout already completed' });
    }

    transaction.status = 'paid_out';
    await transaction.save();

    await logAdminAction({
      adminId: req.user.userId,
      action: 'MARK_PAYOUT',
      targetType: 'transaction',
      targetId: transactionId
    });

    res.json({
      success: true,
      message: 'Seller payout marked as paid'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/users/:userId/ban', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent self-ban
    if (userId === req.user.userId) {
      return res.status(400).json({ message: 'Cannot ban yourself' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.banned = true;
    await user.save();

    await logAdminAction({
      adminId: req.user.userId,
      action: 'BAN_USER',
      targetType: 'user',
      targetId: userId
    });

    res.json({
      success: true,
      message: 'User banned'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/users/:userId/unban', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.banned = false;
    await user.save();

    await logAdminAction({
      adminId: req.user.userId,
      action: 'UNBAN_USER',
      targetType: 'user',
      targetId: userId
    });

    res.json({
      success: true,
      message: 'User unbanned'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all listings (including disabled)
router.get('/admin/listings', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const listings = await ItemListing.find({})
      .populate('seller', 'discordUsername discordId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      listings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/listings/:listingId/disable', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await ItemListing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Set status to disabled_by_admin (soft delete - remains in DB)
    listing.status = 'disabled_by_admin';
    await listing.save();

    await logAdminAction({
      adminId: req.user.userId,
      action: 'DISABLE_LISTING',
      targetType: 'listing',
      targetId: listingId,
      note: `Disabled listing: ${listing.title}`
    });

    res.json({
      success: true,
      message: 'Listing disabled by admin'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/listings/:listingId/remove', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await ItemListing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    await ItemListing.findByIdAndDelete(listingId);

    await logAdminAction({
      adminId: req.user.userId,
      action: 'REMOVE_LISTING',
      targetType: 'listing',
      targetId: listingId
    });

    res.json({
      success: true,
      message: 'Listing removed permanently'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/orders/:orderId/dispute', protect, authorizeRoles('user', 'seller'), async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason, description } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: 'Reason is required' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization: only buyer or seller can dispute
    if (order.buyer.toString() !== req.user.userId && order.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to dispute this order' });
    }

    // Check if order is completed - cannot dispute completed orders
    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Cannot dispute a completed order' });
    }

    // Check if order is already disputed
    if (order.status === 'disputed') {
      return res.status(400).json({ message: 'Order is already disputed' });
    }

    // Check for existing active dispute
    const existingDispute = await Dispute.findOne({
      order: orderId,
      status: 'open'
    });
    if (existingDispute) {
      return res.status(400).json({ message: 'An active dispute already exists for this order' });
    }

    const raisedBy = req.user.userId;
    const against = order.buyer.toString() === req.user.userId ? order.seller : order.buyer;

    // Create dispute
    const dispute = await Dispute.create({
      order: orderId,
      raisedBy,
      against,
      reason: reason.trim(),
      description: description ? description.trim() : ''
    });

    // Freeze order by setting status to "disputed"
    order.status = 'disputed';
    await order.save();

    res.json({
      success: true,
      dispute,
      message: 'Dispute raised successfully. Order has been frozen.'
    });
  } catch (error) {
    console.error('Dispute creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/disputes', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status, orderId, userId } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    if (orderId) {
      query.order = orderId;
    }
    if (userId) {
      query.$or = [
        { raisedBy: userId },
        { against: userId }
      ];
    }

    const disputes = await Dispute.find(query)
      .populate('order')
      .populate('raisedBy', 'discordUsername discordId')
      .populate('against', 'discordUsername discordId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      disputes
    });
  } catch (error) {
    console.error('Disputes fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to restore stock for an order
async function restoreOrderStock(order) {
  if (!order || !order.listing || !order.quantity) {
    return;
  }

  const listing = await ItemListing.findById(order.listing);
  if (listing) {
    listing.stock = (listing.stock || 0) + order.quantity;

    // Reactivate listing if it was marked as sold
    if (listing.status === 'sold' && listing.stock > 0) {
      listing.status = 'active';
    }

    await listing.save();
  }
}

router.post('/disputes/:disputeId/resolve', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { resolutionNote, restoreOrderStatus, restoreStock } = req.body;

    const dispute = await Dispute.findById(disputeId);

    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    if (dispute.status === 'resolved') {
      return res.status(400).json({ message: 'Dispute is already resolved' });
    }

    const order = await Order.findById(dispute.order).populate('listing');

    // Resolve dispute
    dispute.status = 'resolved';
    dispute.resolutionNote = resolutionNote || '';
    await dispute.save();

    // Restore order to previous status if requested (admin decision)
    // Default: restore to 'item_delivered' to allow completion
    if (order && order.status === 'disputed') {
      if (restoreOrderStatus) {
        order.status = restoreOrderStatus;
      } else {
        // Default restoration: try to restore to a logical previous state
        // This is a simple approach - in production, you might want to track previous status
        order.status = 'item_delivered';
      }

      // Restore stock if order is cancelled or if admin explicitly requests it
      if (restoreOrderStatus === 'cancelled' || restoreStock === true) {
        await restoreOrderStock(order);
      }

      await order.save();
    }

    await logAdminAction({
      adminId: req.user.userId,
      action: 'RESOLVE_DISPUTE',
      targetType: 'dispute',
      targetId: disputeId,
      note: `Resolved dispute for order ${dispute.order}`
    });

    res.json({
      success: true,
      message: 'Dispute resolved and order status restored'
    });
  } catch (error) {
    console.error('Dispute resolution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/audit-logs', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('admin', 'discordUsername')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      logs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

