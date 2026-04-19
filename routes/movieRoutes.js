const express = require('express');
const router = express.Router();
const { getMovies, getMovieById } = require('../controllers/movieController');

// GET /api/movies - Lấy danh sách tất cả phim (public, không cần xác thực)
router.get('/', getMovies);

// GET /api/movies/:id - Lấy chi tiết một phim (public)
router.get('/:id', getMovieById);

module.exports = router;
