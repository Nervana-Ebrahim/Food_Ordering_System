// Wraps an async controller/middleware function and forwards any thrown
// error to Express's centralized error handler via next().
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
