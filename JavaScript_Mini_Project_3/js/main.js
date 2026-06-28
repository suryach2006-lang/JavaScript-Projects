/* ═══════════════════════════════════════════
   Spendly – main.js
   Global utilities: theme, toast, auth-guard, sidebar
═══════════════════════════════════════════ */

// ── Theme ──────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('spendly_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('spendly_theme', next);
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}

function updateThemeBtn() {
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ── Toast ──────────────────────────────────
function showToast(message, type = 'default', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  // trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ── Auth guard ──────────────────────────────
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

function getCurrentUser() {
  const key = localStorage.getItem('spendly_current_user');
  if (!key) return null;
  const users = JSON.parse(localStorage.getItem('spendly_users') || '{}');
  return users[key] || null;
}

function getCurrentUserKey() {
  return localStorage.getItem('spendly_current_user');
}

function logout() {
  localStorage.removeItem('spendly_current_user');
  window.location.href = 'login.html';
}

// ── Sidebar toggle (mobile) ─────────────────
function initSidebarToggle() {
  const toggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  // close on outside click
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== toggle) {
      sidebar.classList.remove('open');
    }
  });
}

// ── Active nav link ─────────────────────────
function highlightActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) link.classList.add('active');
    else link.classList.remove('active');
  });
}

// ── Topbar user info ────────────────────────
function populateTopbar() {
  const user = getCurrentUser();
  if (!user) return;
  const avatar = document.querySelector('.topbar-avatar');
  const uname  = document.querySelector('.topbar-username');
  if (avatar) avatar.textContent = (user.name || user.email).charAt(0).toUpperCase();
  if (uname)  uname.textContent  = user.name || user.email;
}

// ── Format helpers ──────────────────────────
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatMonth(yyyy, mm) {
  const d = new Date(yyyy, mm - 1, 1);
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

// ── Category emoji map ──────────────────────
const CATEGORY_ICONS = {
  'Food & Dining':    '🍽️',
  'Groceries':        '🛒',
  'Transport':        '🚗',
  'Shopping':         '🛍️',
  'Entertainment':    '🎬',
  'Health':           '💊',
  'Education':        '📚',
  'Utilities':        '⚡',
  'Rent / EMI':       '🏠',
  'Travel':           '✈️',
  'Salary':           '💼',
  'Freelance':        '💻',
  'Investment':       '📈',
  'Gift / Bonus':     '🎁',
  'Other Income':     '💰',
  'Other Expense':    '📌',
};

function getCategoryIcon(cat) {
  return CATEGORY_ICONS[cat] || '📌';
}

const EXPENSE_CATEGORIES = [
  'Food & Dining', 'Groceries', 'Transport', 'Shopping',
  'Entertainment', 'Health', 'Education', 'Utilities',
  'Rent / EMI', 'Travel', 'Other Expense'
];
const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Gift / Bonus', 'Other Income'
];

// ── DOMContentLoaded init ───────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateThemeBtn();
  initSidebarToggle();
  highlightActiveNav();
  populateTopbar();

  // wire theme toggle
  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // wire logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
});