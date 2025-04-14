// controllers/challengeController.js
const User = require('../models/User');
const { initialUsers, targetUser, getRandomLoginUser } = require('../utils/userUtils');

module.exports = {
  getHome: async (req, res) => {
    try {
      const allUsers = await User.find({}, 'username');
      const randomLoginUser = getRandomLoginUser();
      res.render('pages/home', {
        user: req.session.user,
        users: allUsers,
        error: null,
        targetUser,
        initialUsers,
        randomLoginUser,
        canParticipate: !!req.cookies['stay-logged-in'],
      });
    } catch (err) {
      console.error('Error fetching users:', err.message);
      res.render('pages/home', {
        user: req.session.user,
        users: [],
        error: 'Failed to load users. Please try again later.',
        targetUser,
        initialUsers,
        randomLoginUser: null,
        canParticipate: false,
      });
    }
  },

  getAccount: (req, res) => {
    const { username, isVulnerable } = req.auth;
    res.render('pages/account', {
      user: req.session.user,
      username,
      targetUser,
      initialUsers,
      message: `Welcome back, ${username}! You logged in ${isVulnerable ? 'with vulnerability' : 'securely'}!`,
      isVulnerable,
    });
  },

  downloadPasswords: (req, res) => {
    try {
      const passwords = initialUsers.map(u => u.password).join('\n');
      res.setHeader('Content-Disposition', 'attachment; filename=passwords.txt');
      res.setHeader('Content-Type', 'text/plain');
      res.send(passwords);
    } catch (err) {
      console.error('Download passwords error:', err.message);
      res.status(500).render('pages/error', {
        user: req.session.user,
        error: 'Failed to download passwords. Try again later.',
      });
    }
  },
};