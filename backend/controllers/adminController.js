const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');
const Reservation = require('../models/reservationModel');
const mongoose = require('mongoose');

/**
 * @desc    Get dashboard statistics for admin
 * @route   GET /api/v1/admin/stats
 * @access  Private (Admin)
 */
const getAdminStats = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalRestaurants = await Restaurant.countDocuments();
    const pendingRestaurants = await Restaurant.countDocuments({ approvalStatus: 'Pending' });
    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'Pending' });
    const confirmedReservations = await Reservation.countDocuments({ status: 'Confirmed' });
    const rejectedReservations = await Reservation.countDocuments({ status: 'Rejected' });
    const cancelledReservations = await Reservation.countDocuments({ status: 'Cancelled' });

    res.status(200).json({
      success: true,
      stats: {
        totalCustomers,
        totalOwners,
        totalRestaurants,
        pendingRestaurants,
        totalReservations,
        pendingReservations,
        confirmedReservations,
        rejectedReservations,
        cancelledReservations
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users with search & role filter
 * @route   GET /api/v1/admin/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, keyword } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Do NOT expose password hashes in API responses
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user details / role
 * @route   PUT /api/v1/admin/users/:id
 * @access  Private (Admin)
 */
const updateUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid User ID'
      });
    }

    const { name, phone, role } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (role && ['customer', 'owner', 'admin'].includes(role)) {
      updateData.role = role;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/admin/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid User ID'
      });
    }

    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Administrator cannot delete their own active account'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser
};

