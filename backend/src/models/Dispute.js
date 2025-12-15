import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  against: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open'
  },
  resolutionNote: String
}, {
  timestamps: true
});

// Indexes for admin filters
disputeSchema.index({ status: 1 });
disputeSchema.index({ createdAt: -1 });

export default mongoose.model('Dispute', disputeSchema);

