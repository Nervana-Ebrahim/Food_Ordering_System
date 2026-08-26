 import jwt from 'jsonwebtoken';

// Generates a signed JWT containing the user id and role.
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export default generateToken;
