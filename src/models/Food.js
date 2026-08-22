import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      minlength: [2, 'Food name must be at least 2 characters'],
      maxlength: [150, 'Food name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Text index to support name search
foodSchema.index({ name: 'text', description: 'text' });
// Compound index to speed up "get foods by category" + availability filters
foodSchema.index({ category: 1, available: 1 });

const Food = mongoose.model('Food', foodSchema);

export default Food;
