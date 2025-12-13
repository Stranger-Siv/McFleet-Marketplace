import mongoose from 'mongoose';

const sellerRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  note: String
}, {
  timestamps: true
});

// Index to ensure one pending request per user
sellerRequestSchema.index({ user: 1, status: 1 });

export default mongoose.model('SellerRequest', sellerRequestSchema);

