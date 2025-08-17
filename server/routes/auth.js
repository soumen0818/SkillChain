
const express = require('express');
const router = express.Router();
const { signup, login, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.put('/profile', protect, updateProfile);

module.exports = router;
