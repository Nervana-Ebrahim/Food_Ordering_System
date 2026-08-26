import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { registerUser, loginUser } from '../services/auth.service.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;
  const { user, token } = await registerUser({ name, email, password, phone, address, role });
  sendSuccess(res, 201, 'User registered successfully', { user, token });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser({ email, password });
  sendSuccess(res, 200, 'Login successful', { user, token });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, 'Current user fetched successfully', { user: req.user });
});
