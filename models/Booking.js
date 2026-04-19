const mongoose = require('mongoose');

// Schema lưu thông tin đặt vé: liên kết giữa người dùng và phim
const bookingSchema = new mongoose.Schema(
  {
    // Tham chiếu đến người dùng đã đặt vé (ObjectId từ collection users)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Tham chiếu đến phim được đặt (ObjectId từ collection movies)
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    seats: {
      type: Number,
      default: 1,
      min: [1, 'Số ghế phải ít nhất là 1'],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
