import Food from '../models/Food.js';
import ApiError from '../utils/ApiError.js';

// Fetches a food by id and ensures it exists (and optionally is available)
// before it can be used in cart/order flows.
export const getAvailableFoodOrThrow = async (foodId) => {
  const food = await Food.findById(foodId);
  if (!food) {
    throw new ApiError(404, 'Food not found');
  }
  if (!food.available) {
    throw new ApiError(400, `Food '${food.name}' is currently not available`);
  }
  return food;
};

export const buildFoodFilter = (query) => {
  const filter = {};

  if (query.category) filter.category = query.category;
  if (query.available !== undefined) filter.available = query.available === 'true' || query.available === true;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  return filter;
};
