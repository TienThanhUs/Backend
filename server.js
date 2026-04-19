require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Import seed data function
const seedMovies = require('./seedData');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// Cấu hình Middleware toàn cục
// ============================================================

// Cho phép cross-origin requests từ frontend
app.use(cors());

// Giới hạn số request để phòng chống brute-force và DDoS
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Quá nhiều yêu cầu, vui lòng thử lại sau' },
});

// Giới hạn chặt hơn cho các route xác thực
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Quá nhiều lần đăng nhập, vui lòng thử lại sau 15 phút' },
});

app.use(globalLimiter);

// Parse JSON body từ request
app.use(express.json());

// Phục vụ các file tĩnh từ thư mục public (HTML, CSS, JS frontend)
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// Đăng ký các Routes API
// Luồng: Request → Route → Middleware (nếu có) → Controller
// ============================================================

app.use('/api/auth', authLimiter, authRoutes);  // Xác thực người dùng (có rate limit)
app.use('/api/movies', movieRoutes);    // Quản lý phim
app.use('/api/bookings', bookingRoutes); // Đặt vé

// Route mặc định: phục vụ file index.html cho mọi request không khớp API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================
// Kết nối MongoDB và khởi động server
// ============================================================
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('Biến môi trường MONGO_URI chưa được cấu hình. Hãy kiểm tra file .env');
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('Biến môi trường JWT_SECRET chưa được cấu hình. Hãy kiểm tra file .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Đã kết nối MongoDB thành công!');

    // Chạy seed data sau khi kết nối DB thành công
    await seedMovies();

    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();
