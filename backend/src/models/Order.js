import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ItemListing',
    required: true
  },
  middleman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: [
      'pending_payment',
      'paid',
      'item_collected',
      'item_delivered',
      'completed',
      'cancelled'
    ],
    default: 'pending_payment'
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);

