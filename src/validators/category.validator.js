import { body } from 'express-validator';

export const createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('image').optional({ checkFalsy: true }).trim().isString(),
];

export const updateCategoryValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters'),
  body('image').optional({ checkFalsy: true }).trim().isString(),
];
