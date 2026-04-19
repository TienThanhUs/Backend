# Vai trò: Hãy đóng vai một Senior Fullstack Developer. Xây dựng một ứng dụng đặt vé xem phim đơn giản, tập trung vào cấu trúc Backend chuyên nghiệp và giao diện Frontend tối giản, sạch sẽ.

## 1. Yêu cầu về Công nghệ:

Backend: Node.js, Express.js.

Database: MongoDB (sử dụng Mongoose).

Xác thực: JWT (JSON Web Token) để quản lý phiên đăng nhập.

Kiến trúc: Tuân thủ nghiêm ngặt mô hình MVC (Models, Views, Controllers) và tách biệt Routes, Middlewares.

Frontend: HTML/CSS (khuyến khích dùng Tailwind CSS để UI gọn gàng) và Vanilla JS (sử dụng Fetch API để gọi API).

## 2. Các tính năng chính:

Xác thực người dùng: Đăng ký và Đăng nhập. Sử dụng bcrypt để mã hóa mật khẩu.

Middleware bảo mật: Viết một middleware auth.js để kiểm tra JWT. Chỉ người dùng đã đăng nhập mới có thể đặt vé.

Hiển thị phim: Hiển thị danh sách 6-7 bộ phim (Tên, Thể loại, Giá vé, Hình ảnh mẫu).

Logic Đặt vé: Khi nhấn "Đặt vé", hệ thống sẽ tạo một bản ghi Booking trong MongoDB lưu ID người dùng và ID phim.

## 3. Thiết kế RESTful API:

POST /api/auth/register & POST /api/auth/login

GET /api/movies: Lấy danh sách phim.

POST /api/bookings: Đặt vé (Cần token xác thực).

## 4. Yêu cầu cấu trúc phản hồi (File-by-file):
Hãy trình bày code theo cấu trúc thư mục rõ ràng:

Sơ đồ thư mục: Hiển thị cách tổ chức các folder controllers, models, routes, middleware, public.

Backend:

models/: Định nghĩa Schema cho User, Movie, Booking.

middleware/auth.js: Logic kiểm tra và giải mã JWT.

controllers/: Viết logic xử lý riêng cho Auth, Movies và Bookings.

routes/: Định nghĩa các endpoint sạch sẽ.

server.js: File chạy chính, kết nối MongoDB và cấu hình Express.

Frontend (Thư mục public):

index.html: Giao diện chính với Navbar và lưới danh sách phim.

script.js: Xử lý gọi API, lưu JWT vào LocalStorage và cập nhật giao diện.

## 5. Ghi chú về phong cách:

Viết code sạch (Clean Code), có comment tiếng Việt giải thích luồng đi của dữ liệu từ Middleware đến Controller.

Tạo một đoạn mã "Seed data" nhỏ để tự động nạp 7 bộ phim mẫu vào Database khi khởi động server lần đầu.