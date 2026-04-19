const mongoose = require('mongoose');

// Schema định nghĩa cấu trúc dữ liệu phim trong MongoDB
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tên phim là bắt buộc'],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'Thể loại phim là bắt buộc'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Giá vé là bắt buộc'],
      min: [0, 'Giá vé không thể âm'],
    },
    image: {
      type: String,
      required: [true, 'Hình ảnh phim là bắt buộc'],
    },
    description: {
      type: String,
      default: '',
    },
    duration: {
      type: Number, // Thời lượng tính bằng phút
      default: 120,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
