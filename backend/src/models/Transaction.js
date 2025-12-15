import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
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
  middleman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemPrice: {
    type: Number,
    required: true
  },
  commissionPercent: {
    type: Number,
    required: true
  },
  commissionAmount: {
    type: Number,
    required: true
  },
  sellerPayout: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    default: 'UPI'
  },
  status: {
    type: String,
    enum: ['recorded', 'paid_out'],
    default: 'recorded'
  }
}, {
  timestamps: true
});

// Indexes for admin search/filter
transactionSchema.index({ status: 1 });
transactionSchema.index({ paymentMethod: 1 });
transactionSchema.index({ createdAt: -1 });

export default mongoose.model('Transaction', transactionSchema);

