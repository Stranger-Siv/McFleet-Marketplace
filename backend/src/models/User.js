import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true
  },
  discordUsername: String,
  discordAvatar: String,
  role: {
    type: String,
    enum: ['user', 'seller', 'middleman', 'admin'],
    default: 'user'
  },
  reputation: {
    type: Number,
    default: 0
  },
  // Seller rating metrics
  totalDeals: {
    type: Number,
    default: 0,
    min: 0
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: 0
  },
  ratingSum: {
    type: Number,
    default: 0,
    min: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  banned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);

