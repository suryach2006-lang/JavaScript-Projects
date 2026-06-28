/* ═══════════════════════════════════════════
   Spendly – auth.js
   User registration, login, demo seed
═══════════════════════════════════════════ */

const USERS_KEY   = 'spendly_users';
const SESSION_KEY = 'spendly_current_user';

// ── Get all users ──────────────────────────
function getAllUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
}

// ── Save users object ──────────────────────
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Register new user ──────────────────────
function registerUser(name, email, password) {
  const users = getAllUsers();
  const key   = email.trim().toLowerCase();

  if (users[key]) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  // simple hash (not cryptographic — just for demo)
  const hashed = btoa(password + '_spendly_salt');

  users[key] = {
    key,
    name:      name.trim(),
    email:     key,
    password:  hashed,
    createdAt: new Date().toISOString(),
    currency:  '₹',
    avatar:    name.trim().charAt(0).toUpperCase(),
  };

  saveUsers(users);
  return { success: true };
}

// ── Login ──────────────────────────────────
function loginUser(email, password) {
  const users  = getAllUsers();
  const key    = email.trim().toLowerCase();
  const user   = users[key];

  if (!user) {
    return { success: false, message: 'No account found with this email.' };
  }

  const hashed = btoa(password + '_spendly_salt');
  if (user.password !== hashed) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }

  localStorage.setItem(SESSION_KEY, key);
  return { success: true, user };
}

// ── Demo user seed ─────────────────────────
function ensureDemoUser() {
  const users = getAllUsers();
  const key   = 'demo@spendly.app';
  if (users[key]) return; // already exists

  users[key] = {
    key,
    name:      'Demo User',
    email:     key,
    password:  btoa('demo1234_spendly_salt'),
    createdAt: new Date().toISOString(),
    currency:  '₹',
    avatar:    'D',
  };
  saveUsers(users);

  // Seed demo transactions
  const TXN_KEY = `spendly_txns_${key}`;
  if (!localStorage.getItem(TXN_KEY)) {
    const today = new Date();
    const m = today.getMonth() + 1;
    const y = today.getFullYear();
    const pm = m === 1 ? 12 : m - 1;
    const py = m === 1 ? y - 1 : y;

    function d(year, month, day) {
      return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    }

    const txns = [
      // This month
      { id: uid(), type: 'income',  category: 'Salary',        amount: 55000, note: 'Monthly salary',     date: d(y,m,1)  },
      { id: uid(), type: 'expense', category: 'Rent / EMI',    amount: 12000, note: 'House rent',          date: d(y,m,2)  },
      { id: uid(), type: 'expense', category: 'Groceries',     amount: 3200,  note: 'Monthly groceries',   date: d(y,m,4)  },
      { id: uid(), type: 'expense', category: 'Utilities',     amount: 1100,  note: 'Electricity bill',    date: d(y,m,6)  },
      { id: uid(), type: 'expense', category: 'Transport',     amount: 900,   note: 'Petrol',              date: d(y,m,8)  },
      { id: uid(), type: 'expense', category: 'Food & Dining', amount: 1800,  note: 'Restaurant outings',  date: d(y,m,10) },
      { id: uid(), type: 'income',  category: 'Freelance',     amount: 8000,  note: 'Web project payment', date: d(y,m,12) },
      { id: uid(), type: 'expense', category: 'Entertainment', amount: 599,   note: 'OTT subscription',   date: d(y,m,14) },
      { id: uid(), type: 'expense', category: 'Health',        amount: 750,   note: 'Pharmacy',            date: d(y,m,16) },
      { id: uid(), type: 'expense', category: 'Shopping',      amount: 2400,  note: 'Clothes shopping',    date: d(y,m,18) },
      // Previous month
      { id: uid(), type: 'income',  category: 'Salary',        amount: 55000, note: 'Monthly salary',     date: d(py,pm,1)  },
      { id: uid(), type: 'expense', category: 'Rent / EMI',    amount: 12000, note: 'House rent',          date: d(py,pm,2)  },
      { id: uid(), type: 'expense', category: 'Groceries',     amount: 2900,  note: 'Groceries',           date: d(py,pm,5)  },
      { id: uid(), type: 'expense', category: 'Transport',     amount: 1200,  note: 'Auto & Ola',          date: d(py,pm,8)  },
      { id: uid(), type: 'expense', category: 'Food & Dining', amount: 2100,  note: 'Dining out',          date: d(py,pm,12) },
      { id: uid(), type: 'income',  category: 'Gift / Bonus',  amount: 3000,  note: 'Birthday gift',       date: d(py,pm,15) },
      { id: uid(), type: 'expense', category: 'Health',        amount: 1200,  note: 'Doctor visit',        date: d(py,pm,18) },
      { id: uid(), type: 'expense', category: 'Entertainment', amount: 1200,  note: 'Movie + snacks',      date: d(py,pm,20) },
      { id: uid(), type: 'expense', category: 'Shopping',      amount: 3500,  note: 'Online shopping',     date: d(py,pm,25) },
      { id: uid(), type: 'expense', category: 'Utilities',     amount: 980,   note: 'Wifi + electricity',  date: d(py,pm,28) },
    ].map(t => ({ ...t, createdAt: new Date().toISOString() }));

    localStorage.setItem(TXN_KEY, JSON.stringify(txns));
  }
}

// ── Update user profile ────────────────────
function updateUserProfile(fields) {
  const key   = localStorage.getItem(SESSION_KEY);
  if (!key) return { success: false, message: 'Not logged in.' };
  const users = getAllUsers();
  if (!users[key]) return { success: false, message: 'User not found.' };
  Object.assign(users[key], fields);
  saveUsers(users);
  return { success: true };
}

// ── Change password ────────────────────────
function changePassword(currentPass, newPass) {
  const key  = localStorage.getItem(SESSION_KEY);
  if (!key) return { success: false, message: 'Not logged in.' };
  const users = getAllUsers();
  const user  = users[key];
  if (!user) return { success: false, message: 'User not found.' };
  const hashed = btoa(currentPass + '_spendly_salt');
  if (user.password !== hashed) return { success: false, message: 'Current password is incorrect.' };
  users[key].password = btoa(newPass + '_spendly_salt');
  saveUsers(users);
  return { success: true };
}

// ── Tiny UID ───────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}