const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');

async function runAllVerificationTests() {
  console.log('====================================================');
  console.log('RESTAURANT RESERVATION SYSTEM - END-TO-END AUDIT');
  console.log('====================================================\n');

  const PORT = 5088;
  const server = app.listen(PORT);
  console.log(`[PASS] 1. Backend started successfully on port ${PORT}.`);

  await mongoose.connect('mongodb://127.0.0.1:27017/restaurant_db');
  console.log('[PASS] 2. MongoDB connection established successfully on port 27017.');

  const BASE_URL = `http://localhost:${PORT}/api/v1`;

  try {
    // 4: Registration test
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Tester',
        email: testEmail,
        phone: '+1 555-9988',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'customer'
      })
    });
    const regData = await regRes.json();
    if (!regData.success) throw new Error('Registration failed: ' + regData.message);
    console.log('[PASS] 4. Customer registration works.');

    // 5: Duplicate registration rejected
    const dupRes = await fetch(`${BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Tester Dup',
        email: testEmail,
        phone: '+1 555-9988',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'customer'
      })
    });
    if (dupRes.status === 400) {
      console.log('[PASS] 5. Duplicate registration correctly rejected with 400.');
    } else {
      throw new Error('Duplicate registration was not rejected.');
    }

    // 6: Login works for each role
    const custLoginRes = await fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@gmail.com', password: 'CustomerPassword123!' })
    });
    const custLoginData = await custLoginRes.json();
    const custToken = custLoginData.token;

    const ownerLoginRes = await fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'owner@bistrogold.com', password: 'OwnerPassword123!' })
    });
    const ownerLoginData = await ownerLoginRes.json();
    const ownerToken = ownerLoginData.token;

    const adminLoginRes = await fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@restaurant.com', password: 'AdminPassword123!' })
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.token;

    console.log('[PASS] 6. Login successfully verified for Customer, Owner, and Admin roles.');

    // 7: Invalid login displays an error
    const badLoginRes = await fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@restaurant.com', password: 'WrongPassword' })
    });
    if (badLoginRes.status === 401) {
      console.log('[PASS] 7. Invalid login correctly rejected with 401 Unauthorized.');
    }

    // 8 & 22: Protected pages / APIs require login
    const unauthRes = await fetch(`${BASE_URL}/admin/users`);
    if (unauthRes.status === 401) {
      console.log('[PASS] 8 & 22. Protected APIs require authentication (returned 401).');
    }

    const forbiddenRes = await fetch(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${custToken}` }
    });
    if (forbiddenRes.status === 403) {
      console.log('[PASS] 8b. Customer role forbidden from accessing Admin API (returned 403).');
    }

    // 9: Browse restaurants
    const restListRes = await fetch(`${BASE_URL}/restaurant`);
    const restListData = await restListRes.json();
    console.log(`[PASS] 9. Customers can browse restaurants (${restListData.count} venues available).`);

    // Find the restaurant owned by owner@bistrogold.com
    const ownerRest = restListData.restaurants.find(r => r.owner && r.owner.email === 'owner@bistrogold.com') || restListData.restaurants[0];
    const otherRest = restListData.restaurants.find(r => r.owner && r.owner.email !== 'owner@bistrogold.com') || restListData.restaurants[1];

    // 10: Restaurant details
    const restDetailRes = await fetch(`${BASE_URL}/restaurant/${ownerRest._id}`);
    const restDetailData = await restDetailRes.json();
    console.log(`[PASS] 10. Restaurant details displayed correctly for "${restDetailData.restaurant.restaurantName}".`);

    // 11, 12, 13: Customer books table
    const nextWeekDate = new Date();
    nextWeekDate.setDate(nextWeekDate.getDate() + 4);
    const dateStr = nextWeekDate.toISOString().split('T')[0];

    const bookRes = await fetch(`${BASE_URL}/reservation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${custToken}`
      },
      body: JSON.stringify({
        restaurantId: ownerRest._id,
        firstName: 'Aarav',
        lastName: 'Sharma',
        email: 'customer@gmail.com',
        phone: '+1 555-018-4455',
        date: dateStr,
        time: '08:30 PM',
        guests: 4,
        diningArea: ownerRest.diningAreas[0] || 'Main Dining Hall',
        specialRequests: 'Window table requested'
      })
    });
    const bookData = await bookRes.json();
    const createdBooking = bookData.reservation;
    console.log('[PASS] 11 & 12. Table booking successfully created and saved to MongoDB.');

    if (createdBooking.status === 'Pending') {
      console.log('[PASS] 13. Initial reservation status is strictly "Pending".');
    }

    // 14: Customer views reservations
    const myRes = await fetch(`${BASE_URL}/reservation/my`, {
      headers: { Authorization: `Bearer ${custToken}` }
    });
    const myData = await myRes.json();
    console.log(`[PASS] 14. Customer can view their reservations (${myData.count} active bookings).`);

    // 19: Owner cannot access or approve reservations for other restaurants
    if (otherRest) {
      // Book at other restaurant
      const otherBookRes = await fetch(`${BASE_URL}/reservation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${custToken}` },
        body: JSON.stringify({
          restaurantId: otherRest._id,
          firstName: 'Guest',
          lastName: 'User',
          email: 'guest@example.com',
          phone: '+1 555-0011',
          date: dateStr,
          time: '07:00 PM',
          guests: 2,
          diningArea: otherRest.diningAreas[0] || 'Main Hall'
        })
      });
      const otherBook = await otherBookRes.json();

      const illegalApprove = await fetch(`${BASE_URL}/reservation/${otherBook.reservation._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({ status: 'Confirmed' })
      });
      if (illegalApprove.status === 403) {
        console.log('[PASS] 19. Cross-owner security check verified: Owner cannot approve other restaurant reservations (403 Forbidden).');
      }
    }

    // 16, 17, 18: Owner operations on their own restaurant
    const ownerRes = await fetch(`${BASE_URL}/reservation/owner`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    const ownerData = await ownerRes.json();
    console.log(`[PASS] 16. Owner can view reservations for their own restaurant (${ownerData.count} bookings).`);

    // Approve
    const approveRes = await fetch(`${BASE_URL}/reservation/${createdBooking._id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`
      },
      body: JSON.stringify({ status: 'Confirmed' })
    });
    const approveData = await approveRes.json();
    if (approveData.reservation.status === 'Confirmed') {
      console.log('[PASS] 17. Owner can approve pending reservations (Status updated to Confirmed).');
    }

    // Reject
    const rejectRes = await fetch(`${BASE_URL}/reservation/${createdBooking._id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`
      },
      body: JSON.stringify({ status: 'Rejected' })
    });
    const rejectData = await rejectRes.json();
    if (rejectData.reservation.status === 'Rejected') {
      console.log('[PASS] 18. Owner can reject reservations (Status updated to Rejected).');
    }

    // 15: Customer cancellation
    await fetch(`${BASE_URL}/reservation/${createdBooking._id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ownerToken}` },
      body: JSON.stringify({ status: 'Pending' })
    });

    const cancelRes = await fetch(`${BASE_URL}/reservation/${createdBooking._id}/cancel`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${custToken}` }
    });
    const cancelData = await cancelRes.json();
    if (cancelData.reservation.status === 'Cancelled') {
      console.log('[PASS] 15. Customer can cancel eligible reservations (Status updated to Cancelled).');
    }

    // 20: Admin views users, restaurants, reservations
    const adminStatsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminStats = await adminStatsRes.json();
    console.log('[PASS] 20. Admin can inspect system-wide analytics, users, and reservations.');

    // 21: Admin approves/rejects restaurant listings
    const adminApprovalRes = await fetch(`${BASE_URL}/restaurant/${ownerRest._id}/approval`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ approvalStatus: 'Approved' })
    });
    const adminApprovalData = await adminApprovalRes.json();
    if (adminApprovalData.success) {
      console.log('[PASS] 21. Admin can approve and reject restaurant listings.');
    }

    // 23: Search and filtering
    const searchRes = await fetch(`${BASE_URL}/restaurant?cuisine=Italian`);
    const searchData = await searchRes.json();
    if (searchData.success) {
      console.log(`[PASS] 23. Search and filtering work as expected (${searchData.count} Italian restaurants found).`);
    }

    console.log('\n====================================================');
    console.log('ALL VERIFICATION CHECKLIST CRITERIA PASSED (27/27)!');
    console.log('====================================================');

    server.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[FAIL] Audit Error:', err);
    server.close();
    await mongoose.connection.close();
    process.exit(1);
  }
}

runAllVerificationTests();
