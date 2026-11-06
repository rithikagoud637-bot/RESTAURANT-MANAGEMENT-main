const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');
const { isAuthenticatedUser } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(isAuthenticatedUser, getUserProfile)
  .put(isAuthenticatedUser, updateUserProfile);

module.exports = router;

