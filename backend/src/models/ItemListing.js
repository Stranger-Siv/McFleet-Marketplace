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
    required: true
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

export default mongoose.model('ItemListing', itemListingSchema);

