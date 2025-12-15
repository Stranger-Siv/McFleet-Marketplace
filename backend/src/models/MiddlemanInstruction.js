import mongoose from 'mongoose';

const middlemanInstructionSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  discordId: {
    type: String,
    default: null,
    trim: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACKNOWLEDGED'],
    default: 'PENDING'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  acknowledgedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

middlemanInstructionSchema.index({ order: 1, status: 1 });

export default mongoose.model('MiddlemanInstruction', middlemanInstructionSchema);

