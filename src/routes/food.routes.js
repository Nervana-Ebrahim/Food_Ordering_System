import express from 'express';
import {
  getFoods,
  getFoodById,
  getFoodsByCategory,
  searchFoods,
  createFood,
  updateFood,
  deleteFood,
} from '../controllers/food.controller.js';
import { createFoodValidator, updateFoodValidator, foodQueryValidator } from '../validators/food.validator.js';
import { objectIdParam } from '../validators/common.validator.js';
import validate from '../validators/validate.middleware.js';
import protect from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Foods
 *   description: Food item management, search and filtering
 */

/**
 * @swagger
 * /foods:
 *   get:
 *     summary: Get all foods (paginated, filterable)
 *     tags: [Foods]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: available
 *         schema: { type: boolean }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *     responses:
 *       200: { description: Foods fetched successfully }
 *   post:
 *     summary: Create a food item (Admin only)
 *     tags: [Foods]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, category]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               image: { type: string }
 *               category: { type: string }
 *               available: { type: boolean }
 *     responses:
 *       201: { description: Food created successfully }
 *       403: { description: Forbidden - Admin only }
 */
router.get('/', foodQueryValidator, validate, getFoods);
router.post('/', protect, authorize('Admin'), createFoodValidator, validate, createFood);

/**
 * @swagger
 * /foods/search:
 *   get:
 *     summary: Search foods by name
 *     tags: [Foods]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Search results fetched successfully }
 *       400: { description: Missing search query }
 */
router.get('/search', searchFoods);

/**
 * @swagger
 * /foods/category/{categoryId}:
 *   get:
 *     summary: Get foods by category (paginated)
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Foods fetched successfully }
 *       404: { description: Category not found }
 */
router.get('/category/:categoryId', objectIdParam('categoryId'), validate, getFoodsByCategory);

/**
 * @swagger
 * /foods/{id}:
 *   get:
 *     summary: Get food by ID
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Food fetched successfully }
 *       404: { description: Food not found }
 *   put:
 *     summary: Update a food item (Admin only)
 *     tags: [Foods]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Food updated successfully }
 *   delete:
 *     summary: Delete a food item (Admin only)
 *     tags: [Foods]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Food deleted successfully }
 */
router.get('/:id', objectIdParam('id'), validate, getFoodById);
router.put('/:id', protect, authorize('Admin'), objectIdParam('id'), updateFoodValidator, validate, updateFood);
router.delete('/:id', protect, authorize('Admin'), objectIdParam('id'), validate, deleteFood);

export default router;
