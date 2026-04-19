# 🎬 CineBook - Ứng Dụng Đặt Vé Xem Phim

Ứng dụng đặt vé xem phim đơn giản, xây dựng theo kiến trúc **MVC** với Node.js/Express backend và giao diện Tailwind CSS.

## 📁 Cấu trúc thư mục

```
Backend/
├── controllers/
│   ├── authController.js      # Logic xử lý đăng ký / đăng nhập
│   ├── movieController.js     # Logic lấy danh sách phim
│   └── bookingController.js   # Logic đặt vé và xem lịch sử
├── middleware/
│   └── auth.js                # Middleware xác thực JWT
├── models/
│   ├── User.js                # Schema người dùng (bcrypt hash)
│   ├── Movie.js               # Schema phim
│   └── Booking.js             # Schema đặt vé
├── routes/
│   ├── authRoutes.js          # POST /api/auth/register, /login
│   ├── movieRoutes.js         # GET /api/movies, /api/movies/:id
│   └── bookingRoutes.js       # POST /api/bookings, GET /api/bookings/my
├── public/
│   ├── index.html             # Giao diện chính (Tailwind CSS)
│   └── script.js              # Fetch API, JWT LocalStorage
├── server.js                  # Entry point, kết nối MongoDB
├── seedData.js                # Tự động nạp 7 phim mẫu
├── package.json
└── .env.example
```

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa `.env` với thông tin của bạn:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/movie_booking
JWT_SECRET=your_super_secret_key_here
```

### 3. Khởi động server

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

Server sẽ tự động nạp **7 phim mẫu** vào database khi khởi động lần đầu.

Truy cập: **http://localhost:5000**

## 🔌 API Endpoints

| Method | Endpoint             | Mô tả                       | Auth  |
|--------|----------------------|-----------------------------|-------|
| POST   | `/api/auth/register` | Đăng ký tài khoản           | ❌     |
| POST   | `/api/auth/login`    | Đăng nhập, nhận JWT         | ❌     |
| GET    | `/api/movies`        | Lấy danh sách tất cả phim   | ❌     |
| GET    | `/api/movies/:id`    | Lấy chi tiết một phim       | ❌     |
| POST   | `/api/bookings`      | Đặt vé mới                  | ✅ JWT |
| GET    | `/api/bookings/my`   | Xem lịch sử đặt vé của mình | ✅ JWT |

## 🔐 Xác thực

JWT token được trả về sau khi đăng nhập. Gửi token trong header:

```
Authorization: Bearer <token>
```

## 🛠 Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, bcryptjs
- **Frontend**: HTML, Tailwind CSS, Vanilla JS (Fetch API)
