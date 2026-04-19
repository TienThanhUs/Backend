const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema định nghĩa cấu trúc dữ liệu người dùng trong MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên người dùng là bắt buộc'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    },
  },
  { timestamps: true }
);

// Middleware của Mongoose: tự động mã hóa mật khẩu trước khi lưu vào DB
userSchema.pre('save', async function (next) {
  // Chỉ hash mật khẩu nếu trường password bị thay đổi
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Phương thức so sánh mật khẩu khi đăng nhập
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
