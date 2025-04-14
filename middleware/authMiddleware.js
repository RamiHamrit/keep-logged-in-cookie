// middleware/authMiddleware.js
const User = require('../models/User');
const { verifyToken } = require('../utils/tokenUtils');
const { verifyVulnerableCookie } = require('../utils/cookieUtils');
const { initialUsers } = require('../utils/userUtils');

module.exports.verifyAuth = async (req, res, next) => {
  const token = req.cookies['auth-token'];
  const cookie = req.cookies['stay-logged-in'];

  if (token) {
    const userId = await verifyToken(token);
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        req.auth = { username: user.username, isVulnerable: false };
        return next();
      }
    }
    console.log('Invalid auth-token, redirecting to login');
    return res.redirect('/login');
  }

  if (cookie) {
    const username = verifyVulnerableCookie(cookie, initialUsers);
    if (username) {
      const user = await User.findOne({ username });
      if (user) {
        req.auth = { username, isVulnerable: true };
        return next();
      }
    }
    console.log('Invalid stay-logged-in cookie, redirecting to login');
    return res.redirect('/login');
  }

  console.log('No auth credentials, redirecting to login');
  res.redirect('/login');
};