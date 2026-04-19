const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// POST /api/bookings - Đặt vé mới (yêu cầu đăng nhập)
// protect middleware sẽ xác thực JWT trước khi cho phép vào controller
router.post('/', protect, createBooking);

// GET /api/bookings/my - Xem lịch sử đặt vé của bản thân (yêu cầu đăng nhập)
router.get('/my', protect, getMyBookings);

module.exports = router;
