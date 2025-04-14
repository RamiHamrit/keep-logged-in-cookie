// utils/tokenUtils.js
const crypto = require('crypto');
const Token = require('../models/Token');

const generateToken = async () => {
  return crypto.randomBytes(32).toString('base64');
};

const saveToken = async (userId, token) => {
  await Token.findOneAndUpdate(
    { userId },
    { token, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    { upsert: true }
  );
};

const verifyToken = async (token) => {
  try {
    const storedToken = await Token.findOne({ token });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      return null;
    }
    return storedToken.userId;
  } catch (err) {
    console.error('Token verification error:', err.message);
    return null;
  }
};

module.exports = { generateToken, saveToken, verifyToken };