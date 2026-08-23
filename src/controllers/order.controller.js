import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import ApiError from '../utils/ApiError.js';
import Order from '../models/Order.js';
import { paginate } from '../utils/pagination.js';
import {
  createOrderFromCart,
  cancelOrder as cancelOrderService,
  updateOrderStatus as updateOrderStatusService,
  assertOwnsOrderOrAdmin,
} from '../services/order.service.js';

// @desc    Create an order from the current user's cart
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { address, paymentMethod } = req.body;
  const order = await createOrderFromCart(req.user._id, { address, paymentMethod });
  sendSuccess(res, 201, 'Order created successfully', { order });
});

// @desc    Get current user's orders (paginated, optional status filter)
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Order.countDocuments(filter),
  ]);

  sendSuccess(res, 200, 'Orders fetched successfully', { orders }, {
    page, limit, total, totalPages: Math.ceil(total / limit),
  });
});

// @desc    Get a single order by ID (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new ApiError(404, 'Order not found');

  assertOwnsOrderOrAdmin(order, req.user);

  sendSuccess(res, 200, 'Order fetched successfully', { order });
});

// @desc    Cancel an order (owner while Pending/Confirmed, or Admin any time before Delivered/Cancelled)
// @route   PATCH /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  assertOwnsOrderOrAdmin(order, req.user);

  const updated = await cancelOrderService(order, req.user);
  sendSuccess(res, 200, 'Order cancelled successfully', { order: updated });
});

// @desc    Admin: get all orders (paginated, optional status filter)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').skip(skip).limit(limit).sort({ createdAt: -1 }),
    Order.countDocuments(filter),
  ]);

  sendSuccess(res, 200, 'Orders fetched successfully', { orders }, {
    page, limit, total, totalPages: Math.ceil(total / limit),
  });
});

// @desc    Admin: update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const { status } = req.body;
  const updated = await updateOrderStatusService(order, status);

  sendSuccess(res, 200, 'Order status updated successfully', { order: updated });
});
