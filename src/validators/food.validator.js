import { body, query } from 'express-validator';
import mongoose from 'mongoose';

export const createFoodValidator = [
  body('name').trim().notEmpty().withMessage('Food name is required')
    .isLength({ min: 2, max: 150 }).withMessage('Name must be 2-150 characters'),
  body('description').optional({ checkFalsy: true }).trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('price').notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a number >= 0'),
  body('image').optional({ checkFalsy: true }).trim().isString(),
  body('category').notEmpty().withMessage('Category is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Category must be a valid MongoDB ObjectId'),
  body('available').optional().isBoolean().withMessage('available must be a boolean'),
];

export const updateFoodValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 150 })
    .withMessage('Name must be 2-150 characters'),
  body('description').optional({ checkFalsy: true }).trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a number >= 0'),
  body('image').optional({ checkFalsy: true }).trim().isString(),
  body('category').optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Category must be a valid MongoDB ObjectId'),
  body('available').optional().isBoolean().withMessage('available must be a boolean'),
];

export const foodQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1-100'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be >= 0'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be >= 0'),
  query('available').optional().isBoolean().withMessage('available must be a boolean'),
  query('category').optional().custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('category must be a valid MongoDB ObjectId'),
];
