const Movie = require('../models/Movie');

/**
 * Controller: Lấy danh sách tất cả phim
 *
 * Luồng: Request → GET /api/movies → movieController.getMovies
 *        → Truy vấn MongoDB → Trả về mảng phim
 */
const getMovies = async (req, res) => {
  try {
    // Lấy tất cả phim, sắp xếp theo ngày tạo mới nhất
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({ message: 'Lấy danh sách phim thành công', data: movies });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Controller: Lấy thông tin chi tiết một phim
 *
 * Luồng: Request → GET /api/movies/:id → Tìm phim theo ID → Trả về thông tin phim
 */
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Không tìm thấy phim' });
    }
    res.json({ message: 'Lấy thông tin phim thành công', data: movie });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { getMovies, getMovieById };
