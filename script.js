import { transactions, addTransaction, calculateSummary, saveTransactions } from './data.js';
import { renderChart } from './chart.js';

// === DOM Elements ===
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const transactionList = document.getElementById('transaction-list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const chartCanvas = document.getElementById('expenseChart');
const errorMessage = document.getElementById('error-message');
const clearBtn = document.getElementById('clear-all');

// === Input Filtering ===
amountInput.addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9+\-\.]/g, '');
});
function formatTimestamp(rawDate) {
  const now = new Date();
  const date = new Date(rawDate);

  const isToday = now.toDateString() === date.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;

  if (isToday) {
    return `Today, ${time}`;
  } else if (isYesterday) {
    return `Yesterday, ${time}`;
  } else {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    return `${day} ${month}, ${time}`;
  }
}

// === Show Error Message Inline ===
function showError(msg) {
  errorMessage.textContent = msg;
  setTimeout(() => errorMessage.textContent = '', 3000);
}

// === Form Submit Handler ===
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amountStr = amountInput.value.trim();
  const category = categoryInput.value;

  if (!/^[+-]?\d+(\.\d+)?$/.test(amountStr)) {
    showError('Amount must be a number and can include + or - sign.');
    return;
  }

  const amount = parseFloat(amountStr);

  if (!description) {
    showError('Please enter a description.');
    return;
  }

  const transaction = {
    id: Date.now(),
    description,
    amount,
    category,
    date: new Date().toLocaleString()
  };

  addTransaction(transaction);
  renderUI();
  form.reset();
  descriptionInput.focus(); // auto-focus for quick entry
});

// === Render Transactions with Date and Color ===
function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.forEach(t => {
    const li = document.createElement('li');
    li.classList.add(t.amount >= 0 ? 'income' : 'expense');
    const formattedTime = formatTimestamp(t.date);
    li.textContent = `${t.description} (${t.category}): ${t.amount >= 0 ? '+' : ''}${t.amount} – ${formattedTime}`;
    transactionList.appendChild(li);
  });
}

// === Summary Balances ===
function renderSummary() {
  const { income, expense, balance } = calculateSummary();
  incomeEl.textContent = `$${income.toFixed(2)}`;
  expenseEl.textContent = `$${Math.abs(expense).toFixed(2)}`;
  balanceEl.textContent = `$${balance.toFixed(2)}`;
}

// === UI Orchestration ===
function renderUI() {
  renderTransactions();
  renderSummary();
  renderChart(chartCanvas);
}

// === Clear All Button Logic ===
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all transactions?')) {
      transactions.length = 0;
      saveTransactions();
      renderUI();
    }
  });
}

// === Initial Load ===
renderUI();
