import ApiError from '../utils/ApiError.js';

// Usage: authorize('Admin') or authorize('Admin', 'Customer')
// Must be used AFTER the `protect` middleware since it relies on req.user.
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized, no user context');
  }
  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, `Role '${req.user.role}' is not allowed to access this resource`);
  }
  next();
};

export default authorize;
