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
  banned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);

