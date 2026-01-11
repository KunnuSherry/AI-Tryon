import mongoose from 'mongoose';

const tryOnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  originalImageUrl: {
    type: String,
    required: true,
  },
  resultImageUrl: {
    type: String,
    required: true,
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['earrings', 'glasses'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index for efficient queries
tryOnSchema.index({ userId: 1, createdAt: -1 });

const TryOn = mongoose.model('TryOn', tryOnSchema);

export default TryOn;
