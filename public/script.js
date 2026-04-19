/**
 * script.js - Frontend Logic cho CineBook
 *
 * Luồng dữ liệu chính:
 * 1. Trang load → fetchMovies() gọi GET /api/movies → render danh sách phim
 * 2. Đăng nhập → POST /api/auth/login → lưu JWT vào localStorage → cập nhật UI
 * 3. Đặt vé → POST /api/bookings (kèm JWT header) → hiển thị thông báo
 */

const API_BASE = '/api';

// ============================================================
// Tiện ích: Lấy / lưu token từ localStorage
// ============================================================

/** Lấy JWT token đã lưu trong localStorage */
const getToken = () => localStorage.getItem('token');

/** Lấy thông tin user đã lưu trong localStorage */
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/** Lưu thông tin đăng nhập vào localStorage */
const saveAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/** Xóa thông tin đăng nhập khỏi localStorage */
const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ============================================================
// Tiện ích: Toast Notification
// ============================================================

/**
 * Hiển thị toast notification
 * @param {string} message - Nội dung thông báo
 * @param {'success'|'error'|'info'} type - Loại thông báo
 */
const showToast = (message, type = 'info') => {
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${colors[type]} text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg max-w-xs`;
  toast.textContent = message;
  container.appendChild(toast);
  // Tự động xóa toast sau 3 giây
  setTimeout(() => toast.remove(), 3000);
};

// ============================================================
// Cập nhật Navbar theo trạng thái đăng nhập
// ============================================================

const updateNavbar = () => {
  const user = getUser();
  const navAuth = document.getElementById('nav-auth');
  const navUser = document.getElementById('nav-user');
  const userNameEl = document.getElementById('user-name');

  if (user) {
    // Đã đăng nhập: hiện thông tin user
    navAuth.classList.add('hidden');
    navUser.classList.remove('hidden');
    navUser.classList.add('flex');
    userNameEl.textContent = user.name;
  } else {
    // Chưa đăng nhập: hiện nút login/register
    navAuth.classList.remove('hidden');
    navUser.classList.add('hidden');
    navUser.classList.remove('flex');
  }
};

// ============================================================
// Đăng xuất
// ============================================================

const logout = () => {
  clearAuth();
  updateNavbar();
  showToast('Đã đăng xuất thành công', 'info');
};

// ============================================================
// Modal: Đăng nhập / Đăng ký
// ============================================================

/** Mở modal với tab chỉ định ('login' hoặc 'register') */
const openModal = (tab = 'login') => {
  document.getElementById('modal-overlay').classList.remove('hidden');
  switchTab(tab);
};

/** Đóng modal xác thực */
const closeModal = () => {
  document.getElementById('modal-overlay').classList.add('hidden');
  // Reset form errors
  document.getElementById('login-error').classList.add('hidden');
  document.getElementById('register-error').classList.add('hidden');
};

/** Chuyển đổi tab Login / Register */
const switchTab = (tab) => {
  const loginForm = document.getElementById('form-login');
  const registerForm = document.getElementById('form-register');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.classList.add('border-primary', 'text-white');
    tabLogin.classList.remove('border-transparent', 'text-gray-400');
    tabRegister.classList.remove('border-primary', 'text-white');
    tabRegister.classList.add('border-transparent', 'text-gray-400');
  } else {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    tabRegister.classList.add('border-primary', 'text-white');
    tabRegister.classList.remove('border-transparent', 'text-gray-400');
    tabLogin.classList.remove('border-primary', 'text-white');
    tabLogin.classList.add('border-transparent', 'text-gray-400');
  }
};

// ============================================================
// Xử lý Đăng nhập
// ============================================================

/**
 * Gửi request POST /api/auth/login
 * Nếu thành công: lưu JWT + thông tin user vào localStorage, cập nhật UI
 */
const handleLogin = async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');
  errorEl.classList.add('hidden');
  btn.disabled = true;
  btn.textContent = 'Đang xử lý...';

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    // Gọi API đăng nhập
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message || 'Đăng nhập thất bại';
      errorEl.classList.remove('hidden');
      return;
    }

    // Lưu JWT và thông tin user vào localStorage
    saveAuth(data.token, data.user);
    updateNavbar();
    closeModal();
    showToast(`Chào mừng, ${data.user.name}! 🎉`, 'success');
  } catch (err) {
    errorEl.textContent = 'Không thể kết nối đến server';
    errorEl.classList.remove('hidden');
    console.error('[handleLogin] Lỗi:', err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Đăng Nhập';
  }
};

// ============================================================
// Xử lý Đăng ký
// ============================================================

/**
 * Gửi request POST /api/auth/register
 * Nếu thành công: lưu JWT + thông tin user, cập nhật UI
 */
const handleRegister = async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('register-error');
  const btn = document.getElementById('register-btn');
  errorEl.classList.add('hidden');
  btn.disabled = true;
  btn.textContent = 'Đang xử lý...';

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  try {
    // Gọi API đăng ký
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.message || 'Đăng ký thất bại';
      errorEl.classList.remove('hidden');
      return;
    }

    // Lưu JWT và thông tin user vào localStorage
    saveAuth(data.token, data.user);
    updateNavbar();
    closeModal();
    showToast(`Đăng ký thành công! Chào mừng, ${data.user.name}! 🎊`, 'success');
  } catch (err) {
    errorEl.textContent = 'Không thể kết nối đến server';
    errorEl.classList.remove('hidden');
    console.error('[handleRegister] Lỗi:', err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Tạo Tài Khoản';
  }
};

// ============================================================
// Tải và Hiển thị danh sách phim
// ============================================================

/**
 * Gọi GET /api/movies để lấy danh sách phim
 * Render từng phim vào lưới HTML
 */
const fetchMovies = async () => {
  const loading = document.getElementById('loading');
  const grid = document.getElementById('movies-grid');
  const errorEl = document.getElementById('movies-error');

  try {
    const res = await fetch(`${API_BASE}/movies`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    loading.classList.add('hidden');
    grid.classList.remove('hidden');

    // Render từng card phim
    grid.innerHTML = data.data.map((movie) => createMovieCard(movie)).join('');

    // Xử lý lỗi load ảnh bằng event delegation (thay vì inline onerror)
    grid.querySelectorAll('img[data-fallback]').forEach((img) => {
      img.addEventListener('error', function () {
        this.src = this.dataset.fallback;
      });
    });

    // Dùng event delegation thay vì inline onclick để xử lý click nút đặt vé
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.book-btn');
      if (!btn) return;
      const card = btn.closest('[data-movie-id]');
      if (card) {
        bookTicket(card.dataset.movieId, card.dataset.movieTitle);
      }
    });
  } catch (err) {
    loading.classList.add('hidden');
    errorEl.classList.remove('hidden');
    console.error('[fetchMovies] Lỗi:', err);
  }
};

/**
 * Tạo HTML card cho một bộ phim
 * Dùng data attribute thay vì inline onclick để tránh XSS qua ID
 * @param {Object} movie - Dữ liệu phim từ API
 * @returns {string} HTML string
 */
const createMovieCard = (movie) => {
  const priceFormatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(movie.price);

  // Kiểm tra URL hình ảnh hợp lệ (chỉ cho phép http/https)
  const imageSrc = safeSrc(movie.image);

  return `
    <div class="movie-card bg-card rounded-2xl overflow-hidden shadow-lg relative group cursor-pointer"
         data-movie-id="${escapeHtml(movie._id)}"
         data-movie-title="${escapeHtml(movie.title)}">
      <!-- Poster phim -->
      <div class="relative">
        <img
          src="${escapeHtml(imageSrc)}"
          alt="${escapeHtml(movie.title)}"
          data-fallback="https://via.placeholder.com/300x400?text=No+Image"
          class="w-full h-64 object-cover"
        />
        <!-- Overlay hiện khi hover -->
        <div class="overlay absolute inset-0 bg-black/70 flex items-center justify-center">
          <button
            class="book-btn bg-primary hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition transform hover:scale-105"
          >
            🎟 Đặt Vé
          </button>
        </div>
      </div>
      <!-- Thông tin phim -->
      <div class="p-4">
        <h3 class="font-bold text-base truncate mb-1">${escapeHtml(movie.title)}</h3>
        <p class="text-gray-400 text-xs mb-2">🎭 ${escapeHtml(movie.genre)}</p>
        <div class="flex items-center justify-between">
          <span class="text-primary font-semibold text-sm">${priceFormatted}</span>
          <span class="text-gray-500 text-xs">⏱ ${movie.duration} phút</span>
        </div>
      </div>
    </div>
  `;
};

// ============================================================
// Logic Đặt vé
// ============================================================

/**
 * Xử lý đặt vé khi người dùng nhấn "Đặt Vé"
 *
 * Luồng: Kiểm tra đăng nhập → Gọi POST /api/bookings
 *        (kèm JWT trong header Authorization) → Hiển thị kết quả
 *
 * @param {string} movieId - ID phim
 * @param {string} movieTitle - Tên phim (để hiển thị thông báo)
 */
const bookTicket = async (movieId, movieTitle) => {
  const token = getToken();

  // Kiểm tra đăng nhập trước khi đặt vé
  if (!token) {
    showToast('Vui lòng đăng nhập để đặt vé!', 'error');
    openModal('login');
    return;
  }

  try {
    // Gọi API đặt vé, gửi JWT trong header Authorization
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // JWT được gửi theo định dạng Bearer token
      },
      body: JSON.stringify({ movieId, seats: 1 }),
    });
    const data = await res.json();

    if (res.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      clearAuth();
      updateNavbar();
      showToast('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
      openModal('login');
      return;
    }

    if (!res.ok) {
      showToast(data.message || 'Đặt vé thất bại', 'error');
      return;
    }

    showToast(`🎉 Đặt vé "${movieTitle}" thành công!`, 'success');
  } catch (err) {
    showToast('Không thể kết nối đến server', 'error');
    console.error('[bookTicket] Lỗi:', err);
  }
};

// ============================================================
// Modal: Lịch sử đặt vé
// ============================================================

/** Mở modal và tải lịch sử đặt vé của người dùng */
const openMyBookings = async () => {
  const token = getToken();
  if (!token) {
    openModal('login');
    return;
  }

  document.getElementById('booking-modal').classList.remove('hidden');
  const listEl = document.getElementById('bookings-list');
  listEl.innerHTML = '<div class="text-center text-gray-400 py-8">Đang tải...</div>';

  try {
    // Gọi GET /api/bookings/my với JWT trong header
    const res = await fetch(`${API_BASE}/bookings/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!res.ok) {
      listEl.innerHTML = '<div class="text-center text-red-400 py-8">Không thể tải dữ liệu</div>';
      return;
    }

    if (data.data.length === 0) {
      listEl.innerHTML = '<div class="text-center text-gray-500 py-8">Bạn chưa đặt vé nào</div>';
      return;
    }

    // Render danh sách vé đã đặt
    listEl.innerHTML = data.data.map((b) => {
      const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.totalPrice);
      const date = new Date(b.createdAt).toLocaleDateString('vi-VN');
      return `
        <div class="flex gap-4 bg-gray-800 rounded-xl p-4">
          <img src="${escapeHtml(safeSrc(b.movie.image, 'https://via.placeholder.com/64x80?text=No+Image'))}" alt="${escapeHtml(b.movie.title)}"
            data-fallback="https://via.placeholder.com/64x80?text=No+Image"
            class="w-16 h-20 object-cover rounded-lg flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <h4 class="font-bold truncate">${escapeHtml(b.movie.title)}</h4>
            <p class="text-gray-400 text-xs mt-1">${escapeHtml(b.movie.genre)}</p>
            <p class="text-gray-400 text-xs">📅 ${date} · ${b.seats} ghế</p>
            <p class="text-primary font-semibold text-sm mt-1">${price}</p>
          </div>
          <span class="text-xs text-green-400 font-medium self-start mt-1">✓ Đã đặt</span>
        </div>
      `;
    }).join('');

    // Xử lý lỗi load ảnh bằng event listener (thay vì inline onerror)
    listEl.querySelectorAll('img[data-fallback]').forEach((img) => {
      img.addEventListener('error', function () {
        this.src = this.dataset.fallback;
      });
    });
  } catch (err) {
    listEl.innerHTML = '<div class="text-center text-red-400 py-8">Lỗi kết nối server</div>';
    console.error('[openMyBookings] Lỗi:', err);
  }
};

/** Đóng modal lịch sử đặt vé */
const closeBookingModal = () => {
  document.getElementById('booking-modal').classList.add('hidden');
};

// ============================================================
// Tiện ích bảo mật: Escape HTML để tránh XSS
// ============================================================

const escapeHtml = (str) => {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
};

/**
 * Kiểm tra URL hình ảnh hợp lệ (chỉ cho phép http/https)
 * @param {string} url
 * @returns {string} URL an toàn
 */
const safeSrc = (url, fallback = 'https://via.placeholder.com/300x400?text=No+Image') => {
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') ? url : fallback;
  } catch {
    return fallback;
  }
};

// ============================================================
// Đóng modal khi click ra ngoài
// ============================================================

document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});
document.getElementById('booking-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('booking-modal')) closeBookingModal();
});

// ============================================================
// Khởi tạo trang khi DOM đã sẵn sàng
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar(); // Cập nhật trạng thái đăng nhập từ localStorage
  fetchMovies();  // Tải danh sách phim

  // Gắn event listeners cho các nút Navbar thay vì dùng inline onclick
  document.getElementById('btn-login').addEventListener('click', () => openModal('login'));
  document.getElementById('btn-register').addEventListener('click', () => openModal('register'));
  document.getElementById('btn-my-bookings').addEventListener('click', openMyBookings);
  document.getElementById('btn-logout').addEventListener('click', logout);

  // Gắn event listeners cho các nút đóng modal
  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  document.getElementById('btn-close-bookings').addEventListener('click', closeBookingModal);

  // Gắn event listeners cho tab chuyển đổi trong modal
  document.getElementById('tab-login').addEventListener('click', () => switchTab('login'));
  document.getElementById('tab-register').addEventListener('click', () => switchTab('register'));

  // Gắn event listeners cho forms
  document.getElementById('form-login').addEventListener('submit', handleLogin);
  document.getElementById('form-register').addEventListener('submit', handleRegister);
});
