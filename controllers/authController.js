const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Tạo JWT token từ user id
 * Token có hiệu lực trong 7 ngày
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Controller: Đăng ký tài khoản mới
 *
 * Luồng: Request → Kiểm tra email trùng → Tạo User mới
 *        → Mongoose tự hash password (pre-save hook) → Lưu DB
 *        → Tạo JWT → Trả về token + thông tin user
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra các trường bắt buộc (trim để loại bỏ khoảng trắng)
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }
    // Ép kiểu string để phòng chống NoSQL injection
    const safeName = String(name).trim();
    const safeEmail = String(email).trim().toLowerCase();
    const safePassword = String(password);

    if (!safeName || !safeEmail || !safePassword) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email: safeEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Tạo user mới (password sẽ được hash tự động trong model hook)
    const user = await User.create({ name: safeName, email: safeEmail, password: safePassword });

    // Tạo JWT token cho phiên đăng nhập
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Controller: Đăng nhập
 *
 * Luồng: Request → Tìm user theo email → So sánh password (bcrypt)
 *        → Tạo JWT → Trả về token + thông tin user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra các trường bắt buộc (trim để loại bỏ khoảng trắng)
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }
    // Ép kiểu string để phòng chống NoSQL injection
    const safeEmail = String(email).trim().toLowerCase();
    const safePassword = String(password);

    if (!safeEmail || !safePassword) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    // Tìm user theo email
    const user = await User.findOne({ email: safeEmail });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // So sánh mật khẩu nhập vào với hash trong DB
    const isPasswordCorrect = await user.comparePassword(safePassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Tạo JWT token cho phiên đăng nhập
    const token = generateToken(user._id);

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { register, login };
