   import Cart from '../models/Cart.js';
  import ApiError from '../utils/ApiError.js';
  import { getAvailableFoodOrThrow } from './food.service.js';

  // Fetches (or lazily creates) the cart for a given user.
  export const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
  };

  // Adds a food item to the cart. The price is ALWAYS re-fetched from the
  // Food collection — the frontend-supplied price (if any) is ignored.
  export const addItemToCart = async (userId, foodId, quantity) => {
    const food = await getAvailableFoodOrThrow(foodId);
    const cart = await getOrCreateCart(userId);

    const existingItem = cart.items.find((item) => item.food.toString() === foodId);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = food.price; // refresh to current price
    } else {
      cart.items.push({ food: food._id, quantity, price: food.price });
    }

    await cart.save();
    return cart;
  };

  export const updateItemQuantity = async (userId, foodId, quantity) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError(404, 'Cart not found');

    const item = cart.items.find((i) => i.food.toString() === foodId);
    if (!item) throw new ApiError(404, 'Item not found in cart');

    // Re-validate food still exists/available and refresh price
    const food = await getAvailableFoodOrThrow(foodId);
    item.quantity = quantity;
    item.price = food.price;

    await cart.save();
    return cart;
  };

  export const removeItemFromCart = async (userId, foodId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError(404, 'Cart not found');

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((i) => i.food.toString() !== foodId);

    if (cart.items.length === initialLength) {
      throw new ApiError(404, 'Item not found in cart');
    }

    await cart.save();
    return cart;
  };

  export const clearCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError(404, 'Cart not found');

    cart.items = [];
    await cart.save();
    return cart;
  };
