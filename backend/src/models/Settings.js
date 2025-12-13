import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  commissionPercent: {
    type: Number,
    required: true,
    default: 20
  }
}, {
  timestamps: true
});

export default mongoose.model('Settings', settingsSchema);

