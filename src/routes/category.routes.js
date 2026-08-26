import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { createCategoryValidator, updateCategoryValidator } from '../validators/category.validator.js';
import { objectIdParam } from '../validators/common.validator.js';
import validate from '../validators/validate.middleware.js';
import protect from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';

const router = express.Router();
  
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Food category management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200: { description: Categories fetched successfully }
 *   post:
 *     summary: Create a category (Admin only)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Pizza" }
 *               image: { type: string, example: "https://example.com/pizza.jpg" }
 *     responses:
 *       201: { description: Category created successfully }
 *       403: { description: Forbidden - Admin only }
 */
router.get('/', getCategories);
router.post('/', protect, authorize('Admin'), createCategoryValidator, validate, createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category fetched successfully }
 *       404: { description: Category not found }
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category updated successfully }
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category deleted successfully }
 */
router.get('/:id', objectIdParam('id'), validate, getCategoryById);
router.put('/:id', protect, authorize('Admin'), objectIdParam('id'), updateCategoryValidator, validate, updateCategory);
router.delete('/:id', protect, authorize('Admin'), objectIdParam('id'), validate, deleteCategory);

export default router;
