import express from 'express';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller.js';
import { updateProfileValidator, updateUserRoleValidator } from '../validators/user.validator.js';
import { objectIdParam } from '../validators/common.validator.js';
import validate from '../validators/validate.middleware.js';
import protect from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and admin user-management endpoints
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profile fetched successfully }
 *   put:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Profile updated successfully }
 */
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidator, validate, updateProfile);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Admin - get all users (paginated)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Users fetched successfully }
 *       403: { description: Forbidden - Admin only }
 */
router.get('/', protect, authorize('Admin'), getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Admin - get user by ID
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User fetched successfully }
 *       404: { description: User not found }
 *   delete:
 *     summary: Admin - delete a user
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User deleted successfully }
 *       404: { description: User not found }
 */
router.get('/:id', protect, authorize('Admin'), objectIdParam('id'), validate, getUserById);
router.delete('/:id', protect, authorize('Admin'), objectIdParam('id'), validate, deleteUser);

/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Admin - update a user's role
 *     tags: [Users]
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
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [Admin, Customer] }
 *     responses:
 *       200: { description: User role updated successfully }
 *       404: { description: User not found }
 */
router.patch(
  '/:id/role',
  protect,
  authorize('Admin'),
  objectIdParam('id'),
  updateUserRoleValidator,
  validate,
  updateUserRole
);

export default router;
