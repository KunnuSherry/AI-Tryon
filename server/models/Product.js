import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  category: {
    type: String,
    enum: ['earrings', 'glasses'],
    required: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    original: {
      type: String,
      required: true,
    },
    processed: {
      type: String,
      default: null,
    },
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
    required: true,
  },
  tryOnCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
productSchema.index({ sellerId: 1, status: 1 });
productSchema.index({ status: 1, tryOnCount: -1 });
productSchema.index({ category: 1, status: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;

