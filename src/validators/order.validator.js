 import { body, query } from 'express-validator';
import { ORDER_STATUSES, PAYMENT_METHODS } from '../models/Order.js';

export const createOrderValidator = [
  body('address').trim().notEmpty().withMessage('Delivery address is required')
    .isLength({ max: 300 }).withMessage('Address cannot exceed 300 characters'),
  body('paymentMethod').notEmpty().withMessage('paymentMethod is required')
    .isIn(PAYMENT_METHODS).withMessage(`paymentMethod must be one of: ${PAYMENT_METHODS.join(', ')}`),
];

export const updateOrderStatusValidator = [
  body('status').notEmpty().withMessage('status is required')
    .isIn(ORDER_STATUSES).withMessage(`status must be one of: ${ORDER_STATUSES.join(', ')}`),
];

export const orderQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1-100'),
  query('status').optional().isIn(ORDER_STATUSES).withMessage('Invalid status filter'),
];
