const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: [true, 'Please provide the restaurant name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a description']
    },
    cuisine: {
      type: String,
      required: [true, 'Please specify cuisine type'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Please provide the street address'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please provide the city'],
      trim: true
    },
    contactNumber: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
      trim: true
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'
      ]
    },
    diningAreas: {
      type: [String],
      default: ['Main Dining Hall', 'Outdoor Patio', 'Rooftop Lounge']
    },
    availability: {
      openingTime: {
        type: String,
        default: '11:00 AM'
      },
      closingTime: {
        type: String,
        default: '11:00 PM'
      },
      daysOpen: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      }
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);

