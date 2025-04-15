const User = require('../models/User');
const validator = require('validator');
const { setVulnerableCookie } = require('../utils/cookieUtils');
const { generateToken, saveToken } = require('../utils/tokenUtils');

module.exports = {
  getRegister: (req, res) => {
    res.render('pages/register', { user: req.session.user, error: null });
  },

  postRegister: async (req, res) => {
    let { username, password } = req.body;
    try {
      username = validator.escape(username.trim());
      password = password.trim();

      if (!validator.isLength(username, { min: 3, max: 50 })) {
        return res.render('pages/register', {
          user: req.session.user,
          error: 'Username must be 3-50 characters long! 😅',
        });
      }

      if (!validator.isLength(password, { min: 6 })) {
        return res.render('pages/register', {
          user: req.session.user,
          error: 'Password must be at least 6 characters long! 😅',
        });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.render('pages/register', {
          user: req.session.user,
          error: 'Username already taken. Try another one! 😅',
        });
      }

      const user = new User({ username, password });
      await user.save();
      console.log(`✅ Registered user '${username}'`);
      res.redirect('/login');
    } catch (err) {
      console.error('❌ Registration error:', err.message);
      res.render('pages/register', {
        user: req.session.user,
        error: 'Failed to register. Please try again. 😕',
      });
    }
  },

  getLogin: (req, res) => {
    res.render('pages/login', { user: req.session.user, error: null });
  },

  postLogin: async (req, res) => {
    let { username, password, loginMode } = req.body;
    try {
      username = validator.escape(username.trim());
      password = password.trim();

      if (!validator.isLength(username, { min: 3, max: 50 })) {
        return res.render('pages/login', {
          user: req.session.user,
          error: 'Invalid username format! 😅',
        });
      }

      const user = await User.findOne({ username });
      if (!user) {
        console.log(`❌ Login failed: User '${username}' not found`);
        return res.render('pages/login', {
          user: req.session.user,
          error: 'Invalid username or password. Try again! 🔐',
        });
      }

      if (!(await user.comparePassword(password))) {
        console.log(`❌ Login failed: Incorrect password for '${username}'`);
        return res.render('pages/login', {
          user: req.session.user,
          error: 'Invalid username or password. Try again! 🔐',
        });
      }

      req.session.user = user._id;
      console.log(`✅ Login successful for '${username}'`);

      if (loginMode === 'vulnerable') {
        try {
          await setVulnerableCookie(res, username, password);
          console.log(`✅ Set stay-logged-in cookie for '${username}'`);
          res.redirect('/account');
        } catch (err) {
          console.error('❌ Cookie setting error:', err.message);
          res.render('pages/login', {
            user: req.session.user,
            error: 'Failed to set persistent login. Try again. 😕',
          });
        }
      } else if (loginMode === 'secure') {
        try {
          const token = await generateToken();
          await saveToken(user._id, token);
          res.cookie('auth-token', token, {
            httpOnly: true,
            maxAge: parseInt(process.env.PERSISTENT_SESSION_AGE, 10) || 604800000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          });
          console.log(`✅ Set auth-token for '${username}'`);
          res.redirect('/account');
        } catch (err) {
          console.error('❌ Token setting error:', err.message);
          res.render('pages/login', {
            user: req.session.user,
            error: 'Failed to set secure login. Try again. 😕',
          });
        }
      } else if (loginMode === 'session') {
        console.log(`✅ Session-only login for '${username}'`);
        res.redirect('/account');
      } else {
        console.log(`❌ Invalid login mode for '${username}'`);
        res.render('pages/login', {
          user: req.session.user,
          error: 'Invalid login mode selected. Please try again. 😕',
        });
      }
    } catch (err) {
      console.error('❌ Login error:', err.message);
      res.render('pages/login', {
        user: req.session.user,
        error: 'Login failed. Please try again later. 😕',
      });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('❌ Logout error:', err.message);
      }
      res.clearCookie('stay-logged-in');
      res.clearCookie('auth-token');
      console.log('✅ User logged out');
      res.redirect('/login');
    });
  },
};