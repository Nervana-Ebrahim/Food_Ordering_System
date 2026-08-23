 import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cart.controller.js';
import { addToCartValidator, updateCartItemValidator } from '../validators/cart.validator.js';
import { objectIdParam } from '../validators/common.validator.js';
import validate from '../validators/validate.middleware.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// All cart routes require authentication; a cart always belongs to req.user
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management (always scoped to the logged-in user)
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Cart fetched successfully }
 *   delete:
 *     summary: Clear the entire cart
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Cart cleared successfully }
 */
router.get('/', getCart);
router.delete('/', clearCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add a food item to the cart (price is always fetched fresh from DB)
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [food, quantity]
 *             properties:
 *               food: { type: string, description: "Food ObjectId" }
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: Item added to cart successfully }
 *       400: { description: Food unavailable or invalid quantity }
 *       404: { description: Food not found }
 */
router.post('/items', addToCartValidator, validate, addToCart);

/**
 * @swagger
 * /cart/items/{foodId}:
 *   put:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: Cart item updated successfully }
 *       404: { description: Item not found in cart }
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: foodId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Item removed from cart successfully }
 *       404: { description: Item not found in cart }
 */
router.put('/items/:foodId', objectIdParam('foodId'), updateCartItemValidator, validate, updateCartItem);
router.delete('/items/:foodId', objectIdParam('foodId'), validate, removeCartItem);

export default router;
