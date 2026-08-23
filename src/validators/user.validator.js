import { body } from 'express-validator';

export const updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters'),
  body('phone').optional({ checkFalsy: true }).trim()
    .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Must be a valid phone number'),
  body('address').optional({ checkFalsy: true }).trim()
    .isLength({ max: 300 }).withMessage('Address cannot exceed 300 characters'),
  body('password').optional().isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const updateUserRoleValidator = [
  body('role').notEmpty().withMessage('Role is required')
    .isIn(['Admin', 'Customer']).withMessage('Role must be Admin or Customer'),
];
