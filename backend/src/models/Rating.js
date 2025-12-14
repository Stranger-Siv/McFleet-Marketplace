import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer'
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
ratingSchema.index({ seller: 1 });
ratingSchema.index({ buyer: 1 });
// Note: order field already has unique: true in schema definition, so no need for explicit unique index

export default mongoose.model('Rating', ratingSchema);

