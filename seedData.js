/**
 * Seed Data - Tự động nạp dữ liệu phim mẫu vào Database
 * Hàm này được gọi khi server khởi động lần đầu (khi DB chưa có phim nào)
 */
const Movie = require('./models/Movie');

const sampleMovies = [
  {
    title: 'Avengers: Endgame',
    genre: 'Hành Động / Khoa Học Viễn Tưởng',
    price: 120000,
    image: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    description:
      'Sau sự kiện Thanos tiêu diệt một nửa vũ trụ, các siêu anh hùng còn lại tập hợp để đảo ngược thảm họa.',
    duration: 181,
  },
  {
    title: 'Spider-Man: No Way Home',
    genre: 'Hành Động / Phiêu Lưu',
    price: 110000,
    image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    description:
      'Peter Parker yêu cầu Doctor Strange giúp xóa ký ức của thế giới về danh tính Spider-Man của mình.',
    duration: 148,
  },
  {
    title: 'The Batman',
    genre: 'Hành Động / Tội Phạm',
    price: 105000,
    image: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    description:
      'Batman điều tra một tội phạm bí ẩn để lộ mức độ tham nhũng trong thành phố Gotham.',
    duration: 176,
  },
  {
    title: 'Top Gun: Maverick',
    genre: 'Hành Động / Kịch Tính',
    price: 115000,
    image: 'https://image.tmdb.org/t/p/w500/62HCnUTHOWord7kvMVV6HMXX7bD.jpg',
    description:
      'Sau hơn 30 năm phục vụ, Pete Mitchell vẫn là phi công chiến đấu hàng đầu và phải huấn luyện thế hệ kế tiếp.',
    duration: 130,
  },
  {
    title: 'Doctor Strange in the Multiverse of Madness',
    genre: 'Hành Động / Kinh Dị',
    price: 110000,
    image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
    description:
      'Doctor Strange khám phá đa vũ trụ với sự giúp đỡ của người bạn đồng hành mới America Chavez.',
    duration: 126,
  },
  {
    title: 'Black Panther: Wakanda Forever',
    genre: 'Hành Động / Phiêu Lưu',
    price: 108000,
    image: 'https://image.tmdb.org/t/p/w500/sv1xJUazXoeqkK1n09nwHpHoYoL.jpg',
    description:
      'Người dân Wakanda chiến đấu để bảo vệ vương quốc sau cái chết của Vua T\'Challa.',
    duration: 161,
  },
  {
    title: 'Thor: Love and Thunder',
    genre: 'Hành Động / Hài Hước',
    price: 100000,
    image: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg',
    description:
      'Thor bắt đầu hành trình tìm kiếm bình yên nội tâm nhưng bị gián đoạn bởi Gorr - kẻ tàn sát thần thánh.',
    duration: 119,
  },
];

const seedMovies = async () => {
  try {
    // Kiểm tra xem đã có phim trong DB chưa để tránh nạp trùng
    const count = await Movie.countDocuments();
    if (count > 0) {
      console.log(`📽️  Đã có ${count} phim trong database, bỏ qua seed data.`);
      return;
    }

    // Nạp 7 phim mẫu vào Database
    await Movie.insertMany(sampleMovies);
    console.log('🎬 Seed data: Đã nạp 7 phim mẫu vào Database thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi seed data:', error.message);
  }
};

module.exports = seedMovies;
