const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/userModel');
const Restaurant = require('./models/restaurantModel');
const Reservation = require('./models/reservationModel');
const { hashPassword } = require('./utils/authHelper');

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurant_db');
    console.log('Connected to MongoDB for database seeding...');

    // Clear existing records to ensure a fresh, consistent demo environment
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Reservation.deleteMany();
    console.log('Cleared existing collections.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@restaurant.com',
      phone: '+1 555-010-9999',
      password: hashPassword('AdminPassword123!'),
      role: 'admin'
    });

    const ownerUser = await User.create({
      name: 'Chef Alessandro Rossi',
      email: 'owner@bistrogold.com',
      phone: '+1 555-019-2834',
      password: hashPassword('OwnerPassword123!'),
      role: 'owner'
    });

    const ownerUser2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@auroradining.com',
      phone: '+1 555-014-7721',
      password: hashPassword('OwnerPassword123!'),
      role: 'owner'
    });

    const customerUser = await User.create({
      name: 'Aarav Sharma',
      email: 'customer@gmail.com',
      phone: '+1 555-018-4455',
      password: hashPassword('CustomerPassword123!'),
      role: 'customer'
    });

    console.log('Seeded Users: Admin, 2 Owners, and Customer.');

    // 2. Create Restaurants
    const restaurants = await Restaurant.create([
      {
        restaurantName: 'L’Osteria Bella Vita',
        description: 'An elegant culinary haven bringing authentic Northern Italian flavours, handmade pastas, and fine Tuscan wines in an intimate candlelit ambiance.',
        cuisine: 'Italian & Mediterranean',
        address: '42 Heritage Boulevard, Grand Plaza',
        city: 'New York',
        contactNumber: '+1 555-234-8901',
        images: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
        ],
        diningAreas: ['Main Dining Hall', 'Private Wine Cellar', 'Courtyard Patio', 'Chef’s Counter'],
        availability: {
          openingTime: '12:00 PM',
          closingTime: '11:00 PM',
          daysOpen: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        owner: ownerUser._id,
        approvalStatus: 'Approved'
      },
      {
        restaurantName: 'Saffron & Silk Lounge',
        description: 'A royal gastronomic experience presenting traditional Mughlai kebabs, aromatic Awadhi biryanis, and contemporary Indian fine dining artistry.',
        cuisine: 'North Indian Fine Dining',
        address: '77 Royal Enclave, Embassy Row',
        city: 'San Francisco',
        contactNumber: '+1 555-876-5432',
        images: [
          'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80'
        ],
        diningAreas: ['Royal Banquet Hall', 'Glasshouse Terrace', 'Maharaja Suite'],
        availability: {
          openingTime: '01:00 PM',
          closingTime: '11:30 PM',
          daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        owner: ownerUser._id,
        approvalStatus: 'Approved'
      },
      {
        restaurantName: 'Le Mirage Sky Dining',
        description: 'Perched high atop the skyline with panoramic glass views, offering Michelin-inspired French haute cuisine, champagne pairings, and decadent desserts.',
        cuisine: 'French Contemporary',
        address: '990 Skyline Tower, 45th Floor',
        city: 'Chicago',
        contactNumber: '+1 555-345-6789',
        images: [
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80'
        ],
        diningAreas: ['Skyline Window View', 'Rooftop Starlight Terrace', 'Executive Lounge'],
        availability: {
          openingTime: '05:00 PM',
          closingTime: '12:00 AM',
          daysOpen: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        owner: ownerUser2._id,
        approvalStatus: 'Approved'
      },
      {
        restaurantName: 'Kyoto Blossom Izakaya',
        description: 'Crafted sushi rolls, robata flame grill delights, and artisanal Japanese sake served in a serene bamboo-adorned Zen interior.',
        cuisine: 'Japanese & Asian Fusion',
        address: '15 Sakura Lane, Downtown Waterfront',
        city: 'Seattle',
        contactNumber: '+1 555-432-1098',
        images: [
          'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1200&q=80'
        ],
        diningAreas: ['Zen Garden Patio', 'Sushi Bar Front', 'Tatami Private Room'],
        availability: {
          openingTime: '12:30 PM',
          closingTime: '10:30 PM',
          daysOpen: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        owner: ownerUser2._id,
        approvalStatus: 'Approved'
      }
    ]);

    console.log(`Seeded ${restaurants.length} featured restaurants.`);

    // 3. Create Sample Reservations
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const dateStr1 = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    const dateStr2 = nextWeek.toISOString().split('T')[0];

    await Reservation.create([
      {
        customer: customerUser._id,
        restaurant: restaurants[0]._id,
        firstName: 'Aarav',
        lastName: 'Sharma',
        email: customerUser.email,
        phone: customerUser.phone,
        date: dateStr1,
        time: '07:30 PM',
        guests: 4,
        diningArea: 'Main Dining Hall',
        specialRequests: 'Window table preferred for anniversary dinner.',
        status: 'Pending'
      },
      {
        customer: customerUser._id,
        restaurant: restaurants[1]._id,
        firstName: 'Aarav',
        lastName: 'Sharma',
        email: customerUser.email,
        phone: customerUser.phone,
        date: dateStr2,
        time: '08:00 PM',
        guests: 2,
        diningArea: 'Royal Banquet Hall',
        specialRequests: 'Vegetarian tasting menu requested.',
        status: 'Confirmed'
      }
    ]);

    console.log('Seeded initial reservations.');
    console.log('\nDemo User Accounts for Evaluation:');
    console.log('--------------------------------------------------');
    console.log('1. Admin:    admin@restaurant.com     / AdminPassword123!');
    console.log('2. Owner:    owner@bistrogold.com     / OwnerPassword123!');
    console.log('3. Customer: customer@gmail.com       / CustomerPassword123!');
    console.log('--------------------------------------------------');

    await mongoose.connection.close();
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
};

seedData();

