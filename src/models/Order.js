 import mongoose from 'mongoose';

export const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'OutForDelivery',
  'Delivered',
  'Cancelled',
];

export const PAYMENT_METHODS = ['Cash', 'Card'];

// Order items are a full historical snapshot: foodId, name and price are
// copied at order-creation time so that later changes/deletion of the Food
// document never affect a historical order.
const orderItemSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be greater than 0'],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'Order must contain at least one item',
      },
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    address: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters'],
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: [true, 'Payment method is required'],
    },
  },
  { timestamps: true }
);

// Speed up "get current user's orders" and admin listing/filtering by status
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
