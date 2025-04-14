// routes/challengeRoutes.js
const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', challengeController.getHome);
router.get('/account', authMiddleware.verifyAuth, challengeController.getAccount);
router.get('/download-passwords', challengeController.downloadPasswords);

module.exports = router;