const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const mongoose = require('mongoose');

/**
 * Controller: Tạo đặt vé mới
 *
 * Luồng: Request → protect Middleware (xác thực JWT, gắn req.user)
 *        → bookingController.createBooking
 *        → Kiểm tra phim tồn tại → Tính tổng tiền
 *        → Tạo Booking trong DB → Trả về kết quả
 */
const createBooking = async (req, res) => {
  try {
    const { movieId, seats = 1 } = req.body;

    // Kiểm tra movieId có được cung cấp và là ObjectId hợp lệ không
    if (!movieId || !mongoose.Types.ObjectId.isValid(String(movieId))) {
      return res.status(400).json({ message: 'ID phim không hợp lệ' });
    }
    // Chuyển sang ObjectId để đảm bảo an toàn khi truy vấn DB
    const safeMovieId = new mongoose.Types.ObjectId(String(movieId));

    // Tìm phim theo ID để lấy giá vé
    const movie = await Movie.findById(safeMovieId);
    if (!movie) {
      return res.status(404).json({ message: 'Không tìm thấy phim' });
    }

    // Tính tổng tiền = giá vé × số ghế
    const totalPrice = movie.price * seats;

    // Tạo bản ghi đặt vé mới trong DB
    // req.user._id được lấy từ protect middleware sau khi giải mã JWT
    const booking = await Booking.create({
      user: req.user._id,
      movie: safeMovieId,
      seats,
      totalPrice,
    });

    // Populate để trả về thông tin đầy đủ của phim và user
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title genre price image')
      .populate('user', 'name email');

    res.status(201).json({
      message: 'Đặt vé thành công',
      data: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Controller: Lấy lịch sử đặt vé của người dùng hiện tại
 *
 * Luồng: Request → protect Middleware (xác thực JWT, gắn req.user)
 *        → bookingController.getMyBookings → Truy vấn DB theo user ID
 *        → Trả về danh sách vé đã đặt
 */
const getMyBookings = async (req, res) => {
  try {
    // Lọc booking theo user ID từ JWT token (req.user được gắn bởi protect middleware)
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title genre price image duration')
      .sort({ createdAt: -1 });

    res.json({ message: 'Lấy lịch sử đặt vé thành công', data: bookings });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { createBooking, getMyBookings };
