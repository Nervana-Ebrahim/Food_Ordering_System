import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

// Verifies the JWT sent in the Authorization header ("Bearer <token>"),
// loads the corresponding user (without password) and attaches it to req.user.
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Not authorized, invalid or expired token');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'Not authorized, user no longer exists');
  }

  req.user = user;
  next();
});

export default protect;
