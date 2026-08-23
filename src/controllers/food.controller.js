import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import ApiError from '../utils/ApiError.js';
import Food from '../models/Food.js';
import Category from '../models/Category.js';
import { paginate } from '../utils/pagination.js';
import { buildFoodFilter } from '../services/food.service.js';

// @desc    Get all foods (supports pagination + filtering via query params)
// @route   GET /api/foods
// @access  Public
export const getFoods = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = buildFoodFilter(req.query);

  const [foods, total] = await Promise.all([
    Food.find(filter).populate('category', 'name image').skip(skip).limit(limit).sort({ createdAt: -1 }),
    Food.countDocuments(filter),
  ]);

  sendSuccess(res, 200, 'Foods fetched successfully', { foods }, {
    page, limit, total, totalPages: Math.ceil(total / limit),
  });
});

// @desc    Get food by ID
// @route   GET /api/foods/:id
// @access  Public
export const getFoodById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id).populate('category', 'name image');
  if (!food) throw new ApiError(404, 'Food not found');
  sendSuccess(res, 200, 'Food fetched successfully', { food });
});

// @desc    Get foods by category (paginated)
// @route   GET /api/foods/category/:categoryId
// @access  Public
export const getFoodsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(404, 'Category not found');

  const { page, limit, skip } = paginate(req.query);
  const filter = { category: categoryId };

  const [foods, total] = await Promise.all([
    Food.find(filter).populate('category', 'name image').skip(skip).limit(limit).sort({ createdAt: -1 }),
    Food.countDocuments(filter),
  ]);

  sendSuccess(res, 200, 'Foods fetched successfully', { foods }, {
    page, limit, total, totalPages: Math.ceil(total / limit),
  });
});

// @desc    Search foods by name (uses text index, falls back to regex for partial matches)
// @route   GET /api/foods/search?q=term
// @access  Public
export const searchFoods = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    throw new ApiError(400, 'Query parameter "q" is required for search');
  }

  const { page, limit, skip } = paginate(req.query);
  // Regex search gives better partial-match UX than $text for short food names
  const filter = { name: { $regex: q.trim(), $options: 'i' } };

  const [foods, total] = await Promise.all([
    Food.find(filter).populate('category', 'name image').skip(skip).limit(limit).sort({ name: 1 }),
    Food.countDocuments(filter),
  ]);

  sendSuccess(res, 200, 'Search results fetched successfully', { foods }, {
    page, limit, total, totalPages: Math.ceil(total / limit),
  });
});

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Admin
export const createFood = asyncHandler(async (req, res) => {
  const { name, description, price, image, category, available } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) throw new ApiError(400, 'Category does not exist');

  const food = await Food.create({ name, description, price, image, category, available });
  sendSuccess(res, 201, 'Food created successfully', { food });
});

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
export const updateFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) throw new ApiError(404, 'Food not found');

  const { name, description, price, image, category, available } = req.body;

  if (category !== undefined) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) throw new ApiError(400, 'Category does not exist');
    food.category = category;
  }
  if (name !== undefined) food.name = name;
  if (description !== undefined) food.description = description;
  if (price !== undefined) food.price = price;
  if (image !== undefined) food.image = image;
  if (available !== undefined) food.available = available;

  await food.save();
  sendSuccess(res, 200, 'Food updated successfully', { food });
});

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
export const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) throw new ApiError(404, 'Food not found');

  await food.deleteOne();
  sendSuccess(res, 200, 'Food deleted successfully');
});
