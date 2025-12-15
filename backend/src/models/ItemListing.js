import mongoose from 'mongoose';

const itemListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  survival: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    // CRITICAL: No getters, setters, or transformations
    // Store and return price EXACTLY as provided
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  description: {
    type: String,
    default: '',
    maxlength: 2000
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'removed', 'disabled_by_admin'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes for admin search/filter
itemListingSchema.index({ title: 1 });
itemListingSchema.index({ itemName: 1 });
itemListingSchema.index({ status: 1 });
itemListingSchema.index({ price: 1 });
itemListingSchema.index({ createdAt: -1 });

export default mongoose.model('ItemListing', itemListingSchema);

