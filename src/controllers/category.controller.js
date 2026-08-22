import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import ApiError from '../utils/ApiError.js';
import Category from '../models/Category.js';
import Food from '../models/Food.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  sendSuccess(res, 200, 'Categories fetched successfully', { categories });
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  sendSuccess(res, 200, 'Category fetched successfully', { category });
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  const category = await Category.create({ name, image });
  sendSuccess(res, 201, 'Category created successfully', { category });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  const { name, image } = req.body;
  if (name !== undefined) category.name = name;
  if (image !== undefined) category.image = image;
  await category.save();

  sendSuccess(res, 200, 'Category updated successfully', { category });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  const foodCount = await Food.countDocuments({ category: category._id });
  if (foodCount > 0) {
    throw new ApiError(400, `Cannot delete category: ${foodCount} food item(s) still reference it`);
  }

  await category.deleteOne();
  sendSuccess(res, 200, 'Category deleted successfully');
});
