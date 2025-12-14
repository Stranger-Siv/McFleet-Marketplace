/**
 * Role-based data masking utility
 * Masks sensitive user data (Discord IDs, usernames) based on requester role
 */

/**
 * Masks user object based on requester role
 * @param {Object} user - User object to mask
 * @param {string} requesterRole - Role of the user making the request
 * @param {Object} options - Additional options
 * @param {boolean} options.isOwnData - Whether this is the requester's own data
 * @param {boolean} options.isBuyer - Whether requester is the buyer in this context
 * @param {boolean} options.isSeller - Whether requester is the seller in this context
 * @returns {Object} Masked user object
 */
export function maskUserData(user, requesterRole, options = {}) {
  if (!user || !user._id) {
    return user;
  }

  const { isOwnData = false, isBuyer = false, isSeller = false } = options;

  // Admin can see all data
  if (requesterRole === 'admin') {
    return user;
  }

  // Middleman can see buyer and seller Discord details
  if (requesterRole === 'middleman') {
    return {
      _id: user._id,
      discordUsername: user.discordUsername || null,
      discordId: user.discordId || null
    };
  }

  // Buyer role: Cannot see seller/middleman Discord details
  if (requesterRole === 'user') {
    // If this is the buyer's own data, they can see their username (but not discordId)
    if (isOwnData || isBuyer) {
      return {
        _id: user._id,
        discordUsername: user.discordUsername || null
        // discordId is always hidden for buyers
      };
    }
    // For seller/middleman data, mask all Discord details
    return {
      _id: user._id
      // No Discord details (no username, no discordId)
    };
  }

  // Seller role: Cannot see buyer Discord details
  if (requesterRole === 'seller') {
    // If this is the seller's own data, they can see their username (but not discordId)
    if (isOwnData || isSeller) {
      return {
        _id: user._id,
        discordUsername: user.discordUsername || null
        // discordId is always hidden for sellers
      };
    }
    // For buyer/middleman data, mask all Discord details
    return {
      _id: user._id
      // No Discord details (no username, no discordId)
    };
  }

  // Default: mask all sensitive data
  return {
    _id: user._id
  };
}

/**
 * Masks order data based on requester role
 * @param {Object} order - Order object to mask
 * @param {string} requesterRole - Role of the user making the request
 * @param {string} requesterUserId - ID of the user making the request
 * @returns {Object} Masked order object
 */
export function maskOrderData(order, requesterRole, requesterUserId) {
  if (!order) {
    return order;
  }

  const isBuyer = order.buyer?._id?.toString() === requesterUserId;
  const isSeller = order.seller?._id?.toString() === requesterUserId;
  const isMiddleman = order.middleman?._id?.toString() === requesterUserId;

  const maskedOrder = {
    _id: order._id,
    status: order.status,
    listing: order.listing,
    quantity: order.quantity,
    unitPrice: order.unitPrice,
    totalPrice: order.totalPrice,
    commissionAmount: order.commissionAmount,
    sellerReceivable: order.sellerReceivable,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };

  // Mask buyer data
  if (order.buyer) {
    maskedOrder.buyer = maskUserData(order.buyer, requesterRole, {
      isOwnData: isBuyer,
      isBuyer: isBuyer
    });
  }

  // Mask seller data
  if (order.seller) {
    maskedOrder.seller = maskUserData(order.seller, requesterRole, {
      isOwnData: isSeller,
      isSeller: isSeller
    });
  }

  // Mask middleman data
  if (order.middleman) {
    maskedOrder.middleman = maskUserData(order.middleman, requesterRole, {
      isOwnData: isMiddleman
    });
  }

  return maskedOrder;
}

/**
 * Masks listing data based on requester role
 * @param {Object} listing - Listing object to mask
 * @param {string} requesterRole - Role of the user making the request
 * @param {string} requesterUserId - ID of the user making the request
 * @returns {Object} Masked listing object
 */
export function maskListingData(listing, requesterRole, requesterUserId) {
  if (!listing) {
    return listing;
  }

  const maskedListing = {
    _id: listing._id,
    title: listing.title,
    itemName: listing.itemName,
    category: listing.category,
    survival: listing.survival,
    price: listing.price,
    stock: listing.stock,
    description: listing.description,
    status: listing.status,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt
  };

  // Mask seller data
  if (listing.seller) {
    const isOwnListing = listing.seller._id?.toString() === requesterUserId;
    const maskedSeller = maskUserData(listing.seller, requesterRole, {
      isOwnData: isOwnListing,
      isSeller: isOwnListing
    });
    // Always include rating info (public data) - safely handle missing fields
    if (maskedSeller) {
      maskedSeller.totalDeals = listing.seller?.totalDeals ?? 0;
      maskedSeller.totalRatings = listing.seller?.totalRatings ?? 0;
      maskedSeller.averageRating = listing.seller?.averageRating ?? 0;
      maskedListing.seller = maskedSeller;
    }
  }

  return maskedListing;
}

