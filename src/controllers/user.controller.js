import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import { paginate } from '../utils/pagination.js';

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, 'Profile fetched successfully', { user: req.user });
});

// @desc    Update current user's profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'address', 'password'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const user = await User.findById(req.user._id).select('+password');
  Object.assign(user, updates);
  await user.save(); // triggers password hashing pre-save hook if password changed

  sendSuccess(res, 200, 'Profile updated successfully', { user });
});

// @desc    Admin: get all users (paginated)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);

  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);

  sendSuccess(res, 200, 'Users fetched successfully', { users }, {
    page, limit, total, totalPages: Math.ceil(total / limit),
  });
});

// @desc    Admin: get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  sendSuccess(res, 200, 'User fetched successfully', { user });
});

// @desc    Admin: update a user's role
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.role = role;
  await user.save();

  sendSuccess(res, 200, 'User role updated successfully', { user });
});

// @desc    Admin: delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  await user.deleteOne();

  sendSuccess(res, 200, 'User deleted successfully');
});
