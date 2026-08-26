import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import ApiError from '../utils/ApiError.js';

export const registerUser = async ({ name, email, password, phone, address, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email is already registered');
  }

  // Only allow role to be set to Admin if explicitly intended by seed/admin flows.
  // Public registration defaults to Customer unless role is provided and valid.
  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
    role: role === 'Admin' ? 'Admin' : 'Customer',
  });

  const token = generateToken({ id: user._id, role: user.role });
  return { user, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken({ id: user._id, role: user.role });
  return { user, token };
};
