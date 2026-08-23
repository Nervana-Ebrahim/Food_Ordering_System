 import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import {
  createOrderValidator,
  updateOrderStatusValidator,
  orderQueryValidator,
} from '../validators/order.validator.js';
import { objectIdParam } from '../validators/common.validator.js';
import validate from '../validators/validate.middleware.js';
import protect from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order creation and management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order from the current user's cart
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [address, paymentMethod]
 *             properties:
 *               address: { type: string }
 *               paymentMethod: { type: string, enum: [Cash, Card] }
 *     responses:
 *       201: { description: Order created successfully }
 *       400: { description: Cart is empty or contains unavailable items }
 *   get:
 *     summary: Admin - get all orders (paginated, filterable by status)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Pending, Confirmed, Preparing, OutForDelivery, Delivered, Cancelled] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Orders fetched successfully }
 *       403: { description: Forbidden - Admin only }
 */
router.post('/', createOrderValidator, validate, createOrder);
router.get('/', authorize('Admin'), orderQueryValidator, validate, getAllOrders);

/**
 * @swagger
 * /orders/my:
 *   get:
 *     summary: Get current user's orders (paginated, filterable by status)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Orders fetched successfully }
 */
router.get('/my', orderQueryValidator, validate, getMyOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID (owner or Admin only)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Order fetched successfully }
 *       403: { description: Not allowed to access this order }
 *       404: { description: Order not found }
 */
router.get('/:id', objectIdParam('id'), validate, getOrderById);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order (owner while Pending/Confirmed, or Admin any time before Delivered/Cancelled)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Order cancelled successfully }
 *       400: { description: Order can no longer be cancelled }
 */
router.patch('/:id/cancel', objectIdParam('id'), validate, cancelOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Admin - update order status
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [Pending, Confirmed, Preparing, OutForDelivery, Delivered, Cancelled] }
 *     responses:
 *       200: { description: Order status updated successfully }
 *       403: { description: Forbidden - Admin only }
 */
router.patch(
  '/:id/status',
  authorize('Admin'),
  objectIdParam('id'),
  updateOrderStatusValidator,
  validate,
  updateOrderStatus
);

export default router;
