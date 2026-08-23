 // Extracts and sanitizes page/limit query params into a consistent shape
// used across Foods, Users and Orders listing endpoints.
export const paginate = (query, defaultLimit = 10, maxLimit = 100) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(limit) || limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
