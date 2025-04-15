const User = require('../models/User');
const { verifyToken } = require('../utils/tokenUtils');
const { verifyVulnerableCookie } = require('../utils/cookieUtils');
const { initialUsers } = require('../utils/userUtils');

module.exports.verifyAuth = async (req, res, next) => {
  const token = req.cookies['auth-token'];
  const cookie = req.cookies['stay-logged-in'];
  const sessionUser = req.session.user;

  // Check for secure token first
  if (token) {
    const userId = await verifyToken(token);
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        req.auth = { username: user.username, isVulnerable: false, isSessionOnly: false };
        return next();
      }
    }
    console.log('❌ Invalid auth-token, redirecting to login');
    return res.redirect('/login');
  }

  // Check for vulnerable cookie
  if (cookie) {
    const username = verifyVulnerableCookie(cookie, initialUsers);
    if (username) {
      const user = await User.findOne({ username });
      if (user) {
        req.auth = { username, isVulnerable: true, isSessionOnly: false };
        return next();
      }
    }
    console.log('❌ Invalid stay-logged-in cookie, redirecting to login');
    return res.redirect('/login');
  }

  // Check for session-only login
  if (sessionUser) {
    const user = await User.findById(sessionUser);
    if (user) {
      req.auth = { username: user.username, isVulnerable: false, isSessionOnly: true };
      return next();
    }
    console.log('❌ Invalid session user, clearing session');
    req.session.destroy();
  }

  console.log('❌ No auth credentials, redirecting to login');
  res.redirect('/login');
};