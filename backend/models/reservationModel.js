const mongoose = require('mongoose');
const validator = require('validator');

const reservationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      validate: [validator.isEmail, 'Please provide a valid email address'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true
    },
    date: {
      type: String,
      required: [true, 'Please provide reservation date']
    },
    time: {
      type: String,
      required: [true, 'Please provide reservation time']
    },
    guests: {
      type: Number,
      required: [true, 'Please provide number of guests'],
      min: [1, 'Guest count must be at least 1'],
      max: [50, 'Guest count cannot exceed 50']
    },
    diningArea: {
      type: String,
      required: [true, 'Please select a dining area'],
      default: 'Main Dining Hall'
    },
    specialRequests: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Rejected', 'Cancelled'],
      default: 'Pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);

