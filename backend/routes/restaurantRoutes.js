const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getOwnerRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  updateRestaurantApproval
} = require('../controllers/restaurantController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllRestaurants)
  .post(isAuthenticatedUser, authorizeRoles('owner', 'admin'), createRestaurant);

router.get('/owner/my', isAuthenticatedUser, authorizeRoles('owner'), getOwnerRestaurant);

router.route('/:id')
  .get(getRestaurantById)
  .put(isAuthenticatedUser, authorizeRoles('owner', 'admin'), updateRestaurant)
  .delete(isAuthenticatedUser, authorizeRoles('owner', 'admin'), deleteRestaurant);

router.put('/:id/approval', isAuthenticatedUser, authorizeRoles('admin'), updateRestaurantApproval);

module.exports = router;

