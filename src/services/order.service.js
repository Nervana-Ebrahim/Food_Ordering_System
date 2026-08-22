 import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Food from '../models/Food.js';
import ApiError from '../utils/ApiError.js';

const NON_MODIFIABLE_STATUSES = ['Delivered', 'Cancelled'];
const CUSTOMER_CANCELLABLE_STATUSES = ['Pending', 'Confirmed'];

// Creates an Order from the current user's Cart.
// - Recomputes every item's price fresh from the Food collection (never
//   trusts the cart's stored price, in case it went stale).
// - Copies food name + price into the order item so the order stays
//   historically accurate even if the Food document later changes/is removed.
export const createOrderFromCart = async (userId, { address, paymentMethod }) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Cannot create an order from an empty cart');
  }

  const orderItems = [];
  for (const cartItem of cart.items) {
    const food = await Food.findById(cartItem.food);
    if (!food) {
      throw new ApiError(400, `A food item in your cart no longer exists`);
    }
    if (!food.available) {
      throw new ApiError(400, `Food '${food.name}' is currently not available`);
    }
    orderItems.push({
      food: food._id,
      name: food.name,
      price: food.price, // fresh price from DB, not from cart
      quantity: cartItem.quantity,
    });
  }

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalPrice,
    address,
    paymentMethod,
    status: 'Pending',
  });

  // Clear the cart after successful order creation
  cart.items = [];
  await cart.save();

  return order;
};

export const cancelOrder = async (order, requestingUser) => {
  if (NON_MODIFIABLE_STATUSES.includes(order.status)) {
    throw new ApiError(400, `Order is already ${order.status.toLowerCase()} and cannot be modified`);
  }

  if (requestingUser.role !== 'Admin' && !CUSTOMER_CANCELLABLE_STATUSES.includes(order.status)) {
    throw new ApiError(400, `Order can no longer be cancelled once it is ${order.status}`);
  }

  order.status = 'Cancelled';
  await order.save();
  return order;
};

export const updateOrderStatus = async (order, newStatus) => {
  if (NON_MODIFIABLE_STATUSES.includes(order.status)) {
    throw new ApiError(400, `Order is already ${order.status.toLowerCase()} and cannot be modified`);
  }
  order.status = newStatus;
  await order.save();
  return order;
};

export const assertOwnsOrderOrAdmin = (order, user) => {
  const isOwner = order.user.toString() === user._id.toString();
  if (!isOwner && user.role !== 'Admin') {
    throw new ApiError(403, 'You are not allowed to access this order');
  }
};
