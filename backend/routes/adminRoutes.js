const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(isAuthenticatedUser, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;

