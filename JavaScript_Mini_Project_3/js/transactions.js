// Get transactions for user
function getTransactions(user) {
  const key = `spendly_txns_${user}`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

// Save transactions
function saveTransactions(user, transactions) {
  const key = `spendly_txns_${user}`;
  localStorage.setItem(key, JSON.stringify(transactions));
}

// Add transaction
function addTransaction(user, txn) {
  const transactions = getTransactions(user);

  txn.id = Date.now().toString();
  txn.createdAt = new Date().toISOString();

  transactions.push(txn);

  saveTransactions(user, transactions);
}