const Reservation = require('../models/reservationModel');
const Restaurant = require('../models/restaurantModel');
const mongoose = require('mongoose');

/**
 * @desc    Create a new reservation
 * @route   POST /api/v1/reservation
 * @access  Private (Customer)
 */
const createReservation = async (req, res, next) => {
  try {
    const {
      restaurantId,
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      guests,
      diningArea,
      specialRequests
    } = req.body;

    if (!restaurantId || !firstName || !lastName || !email || !phone || !date || !time || !guests || !diningArea) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required reservation fields'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Restaurant ID'
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Selected restaurant does not exist'
      });
    }

    // Validate that reservation date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Reservation date cannot be in the past'
      });
    }

    const guestCount = parseInt(guests, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 50) {
      return res.status(400).json({
        success: false,
        message: 'Guest count must be between 1 and 50'
      });
    }

    // Reservation status MUST initially be 'Pending'
    const reservation = await Reservation.create({
      customer: req.user._id,
      restaurant: restaurantId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      date,
      time,
      guests: guestCount,
      diningArea: diningArea.trim(),
      specialRequests: specialRequests ? specialRequests.trim() : '',
      status: 'Pending'
    });

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('restaurant', 'restaurantName address city contactNumber images');

    res.status(201).json({
      success: true,
      message: 'Reservation submitted successfully! Your booking is currently Pending owner confirmation.',
      reservation: populatedReservation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in customer's reservations
 * @route   GET /api/v1/reservation/my
 * @access  Private (Customer)
 */
const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ customer: req.user._id })
      .populate('restaurant', 'restaurantName address city contactNumber images cuisine')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reservations for owner's restaurant
 * @route   GET /api/v1/reservation/owner
 * @access  Private (Owner)
 */
const getOwnerReservations = async (req, res, next) => {
  try {
    // Find all restaurants owned by this user
    const ownerRestaurants = await Restaurant.find({ owner: req.user._id });
    const restaurantIds = ownerRestaurants.map((r) => r._id);

    const { status } = req.query;
    let query = { restaurant: { $in: restaurantIds } };

    if (status && status !== 'all') {
      query.status = status;
    }

    const reservations = await Reservation.find(query)
      .populate('restaurant', 'restaurantName address city')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reservations (Admin)
 * @route   GET /api/v1/reservation/all
 * @access  Private (Admin)
 */
const getAllReservations = async (req, res, next) => {
  try {
    const { status, keyword } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (keyword) {
      query.$or = [
        { firstName: { $regex: keyword, $options: 'i' } },
        { lastName: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } }
      ];
    }

    const reservations = await Reservation.find(query)
      .populate('restaurant', 'restaurantName city address')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single reservation by ID
 * @route   GET /api/v1/reservation/:id
 * @access  Private
 */
const getReservationById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid Reservation ID'
      });
    }

    const reservation = await Reservation.findById(req.params.id)
      .populate('restaurant', 'restaurantName owner address city contactNumber')
      .populate('customer', 'name email phone');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Access control: customer who booked it, owner of the restaurant, or admin
    const isCustomer = reservation.customer && reservation.customer._id.toString() === req.user._id.toString();
    const isOwner = reservation.restaurant && reservation.restaurant.owner && reservation.restaurant.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not have permission to view this reservation'
      });
    }

    res.status(200).json({
      success: true,
      reservation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update reservation status (Owner or Admin approves/rejects)
 * @route   PUT /api/v1/reservation/:id/status
 * @access  Private (Owner or Admin)
 */
const updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Pending, Confirmed, or Rejected'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid Reservation ID'
      });
    }

    const reservation = await Reservation.findById(req.params.id).populate('restaurant');
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // If owner, verify they own the restaurant
    if (req.user.role === 'owner') {
      if (reservation.restaurant.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only update reservations for your own restaurant'
        });
      }
    }

    reservation.status = status;
    await reservation.save();

    res.status(200).json({
      success: true,
      message: `Reservation status updated to ${status}`,
      reservation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Customer cancels their reservation
 * @route   PUT /api/v1/reservation/:id/cancel
 * @access  Private (Customer)
 */
const cancelReservation = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid Reservation ID'
      });
    }

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check customer ownership
    if (reservation.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only cancel your own reservation'
      });
    }

    if (reservation.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This reservation is already cancelled'
      });
    }

    reservation.status = 'Cancelled';
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      reservation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getOwnerReservations,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservation
};

