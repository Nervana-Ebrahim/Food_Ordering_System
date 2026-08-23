import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  getOrCreateCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart as clearCartService,
} from '../services/cart.service.js';

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate('items.food', 'name image available');
  sendSuccess(res, 200, 'Cart fetched successfully', { cart });
});

// @desc    Add a food item to cart (price always re-fetched from DB)
// @route   POST /api/cart/items
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { food, quantity } = req.body;
  const cart = await addItemToCart(req.user._id, food, quantity);
  await cart.populate('items.food', 'name image available');
  sendSuccess(res, 200, 'Item added to cart successfully', { cart });
});

// @desc    Update quantity of a cart item
// @route   PUT /api/cart/items/:foodId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { foodId } = req.params;
  const { quantity } = req.body;
  const cart = await updateItemQuantity(req.user._id, foodId, quantity);
  await cart.populate('items.food', 'name image available');
  sendSuccess(res, 200, 'Cart item updated successfully', { cart });
});

// @desc    Remove an item from cart
// @route   DELETE /api/cart/items/:foodId
// @access  Private
export const removeCartItem = asyncHandler(async (req, res) => {
  const { foodId } = req.params;
  const cart = await removeItemFromCart(req.user._id, foodId);
  await cart.populate('items.food', 'name image available');
  sendSuccess(res, 200, 'Item removed from cart successfully', { cart });
});

// @desc    Clear the entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await clearCartService(req.user._id);
  sendSuccess(res, 200, 'Cart cleared successfully', { cart });
});
