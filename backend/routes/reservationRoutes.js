const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getOwnerReservations,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservation
} = require('../controllers/reservationController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', isAuthenticatedUser, authorizeRoles('customer', 'admin'), createReservation);
router.get('/my', isAuthenticatedUser, authorizeRoles('customer', 'admin'), getMyReservations);
router.get('/owner', isAuthenticatedUser, authorizeRoles('owner', 'admin'), getOwnerReservations);
router.get('/all', isAuthenticatedUser, authorizeRoles('admin'), getAllReservations);

router.route('/:id')
  .get(isAuthenticatedUser, getReservationById);

router.put('/:id/status', isAuthenticatedUser, authorizeRoles('owner', 'admin'), updateReservationStatus);
router.put('/:id/cancel', isAuthenticatedUser, cancelReservation);

module.exports = router;

