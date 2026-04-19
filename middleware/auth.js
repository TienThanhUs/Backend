const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware xác thực JWT
 *
 * Luồng dữ liệu:
 * Request → auth Middleware → (nếu hợp lệ) → Controller
 *                           → (nếu không hợp lệ) → Trả về lỗi 401
 *
 * 1. Đọc header Authorization từ request
 * 2. Tách lấy token (định dạng: "Bearer <token>")
 * 3. Giải mã token bằng JWT_SECRET
 * 4. Tìm user trong DB theo id trong payload
 * 5. Gắn thông tin user vào req.user để Controller sử dụng
 */
const protect = async (req, res, next) => {
  try {
    // Bước 1: Kiểm tra header Authorization có tồn tại và đúng định dạng không
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Không có token xác thực, truy cập bị từ chối' });
    }

    // Bước 2: Tách token khỏi chuỗi "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // Bước 3: Giải mã và xác minh token bằng secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Bước 4: Tìm user trong Database theo id lưu trong token payload
    // Loại bỏ trường password khỏi kết quả trả về bằng .select('-password')
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Token không hợp lệ, người dùng không tồn tại' });
    }

    // Bước 5: Gắn thông tin user vào request để các Controller phía sau sử dụng
    req.user = user;
    next();
  } catch (error) {
    // Xử lý các lỗi JWT: token hết hạn, chữ ký sai, v.v.
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token đã hết hạn, vui lòng đăng nhập lại' });
    }
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = { protect };
