 import mongoose from 'mongoose';

// Cart items reference the live Food price is NOT stored here permanently as
// "truth" — it is recalculated from the Food collection whenever the cart is
// read or modified, since a cart (unlike an order) reflects current prices.
const cartItemSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be greater than 0'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 }, { unique: true });

// Recalculate totalPrice automatically before saving
cartSchema.pre('save', function recalcTotal(next) {
  this.totalPrice = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
