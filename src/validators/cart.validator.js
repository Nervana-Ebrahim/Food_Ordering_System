 import { body } from 'express-validator';
import mongoose from 'mongoose';

export const addToCartValidator = [
  body('food').notEmpty().withMessage('food is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('food must be a valid MongoDB ObjectId'),
  body('quantity').notEmpty().withMessage('quantity is required')
    .isInt({ min: 1 }).withMessage('quantity must be a positive integer greater than 0'),
];

export const updateCartItemValidator = [
  body('quantity').notEmpty().withMessage('quantity is required')
    .isInt({ min: 1 }).withMessage('quantity must be a positive integer greater than 0'),
];
