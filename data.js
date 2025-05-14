// === Transactions State ===
export let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

export function addTransaction(transaction) {
  transactions.push(transaction);
  saveTransactions();
}

export function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

export function calculateSummary() {
  const income = transactions.filter(t => t.amount > 0)
                             .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions.filter(t => t.amount < 0)
                              .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expense,
    balance: income + expense
  };
}
