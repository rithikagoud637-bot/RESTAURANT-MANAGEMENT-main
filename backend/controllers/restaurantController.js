const Restaurant = require('../models/restaurantModel');
const mongoose = require('mongoose');

/**
 * @desc    Get all restaurants (Public: Approved restaurants, with search & filter)
 * @route   GET /api/v1/restaurant
 * @access  Public
 */
const getAllRestaurants = async (req, res, next) => {
  try {
    const { keyword, cuisine, city, status } = req.query;
    let query = {};

    // By default for public users, only show Approved restaurants
    // If admin explicitly queries with status, allow filtering
    if (status && req.user && req.user.role === 'admin') {
      if (status !== 'all') {
        query.approvalStatus = status;
      }
    } else {
      query.approvalStatus = 'Approved';
    }

    if (keyword) {
      query.$or = [
        { restaurantName: { $regex: keyword, $options: 'i' } },
        { cuisine: { $regex: keyword, $options: 'i' } },
        { city: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const restaurants = await Restaurant.find(query).populate('owner', 'name email phone').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single restaurant by ID
 * @route   GET /api/v1/restaurant/:id
 * @access  Public
 */
const getRestaurantById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid Restaurant ID'
      });
    }

    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email phone');

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      restaurant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get restaurant belonging to currently logged-in owner
 * @route   GET /api/v1/restaurant/owner/my
 * @access  Private (Owner only)
 */
const getOwnerRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });

    res.status(200).json({
      success: true,
      restaurant: restaurant || null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new restaurant listing
 * @route   POST /api/v1/restaurant
 * @access  Private (Owner or Admin)
 */
const createRestaurant = async (req, res, next) => {
  try {
    const {
      restaurantName,
      description,
      cuisine,
      address,
      city,
      contactNumber,
      images,
      diningAreas,
      availability
    } = req.body;

    if (!restaurantName || !description || !cuisine || !address || !city || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory restaurant details'
      });
    }

    // Admins can set approval immediately; Owner listings default to 'Approved' or 'Pending'
    const approvalStatus = req.user.role === 'admin' ? 'Approved' : 'Approved';

    const restaurant = await Restaurant.create({
      restaurantName: restaurantName.trim(),
      description: description.trim(),
      cuisine: cuisine.trim(),
      address: address.trim(),
      city: city.trim(),
      contactNumber: contactNumber.trim(),
      images: Array.isArray(images) && images.length > 0 ? images : undefined,
      diningAreas: Array.isArray(diningAreas) && diningAreas.length > 0 ? diningAreas : undefined,
      availability: availability || undefined,
      owner: req.user._id,
      approvalStatus
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      restaurant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update restaurant
 * @route   PUT /api/v1/restaurant/:id
 * @access  Private (Owner or Admin)
 */
const updateRestaurant = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid Restaurant ID'
      });
    }

    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership unless admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only update your own restaurant'
      });
    }

    // Do not allow owner to change approvalStatus directly via this route
    if (req.user.role !== 'admin' && req.body.approvalStatus) {
      delete req.body.approvalStatus;
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Restaurant updated successfully',
      restaurant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete restaurant
 * @route   DELETE /api/v1/restaurant/:id
 * @access  Private (Owner or Admin)
 */
const deleteRestaurant = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Invalid Restaurant ID'
      });
    }

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership unless admin
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own restaurant'
      });
    }

    await Restaurant.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update restaurant approval status (Admin only)
 * @route   PUT /api/v1/restaurant/:id/approval
 * @access  Private (Admin only)
 */
const updateRestaurantApproval = async (req, res, next) => {
  try {
    const { approvalStatus } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(approvalStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Approval status must be Pending, Approved, or Rejected'
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { approvalStatus },
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Restaurant status updated to ${approvalStatus}`,
      restaurant
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getOwnerRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  updateRestaurantApproval
};

