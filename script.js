import { transactions, addTransaction, calculateSummary } from './data.js';
import { renderChart } from './chart.js';

const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const transactionList = document.getElementById('transaction-list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const chartCanvas = document.getElementById('expenseChart');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  if (!description || isNaN(amount)) {
    alert('Please enter valid data.');
    return;
  }

  addTransaction({
    id: Date.now(),
    description,
    amount,
    category
  });

  renderUI();
  form.reset();
});

function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.forEach(t => {
    const li = document.createElement('li');
    li.textContent = `${t.description} (${t.category}): ${t.amount >= 0 ? '+' : ''}${t.amount}`;
    li.style.borderLeftColor = t.amount >= 0 ? '#2ecc71' : '#e74c3c';
    transactionList.appendChild(li);
  });
}

function renderSummary() {
  const { income, expense, balance } = calculateSummary();
  incomeEl.textContent = `$${income.toFixed(2)}`;
  expenseEl.textContent = `$${Math.abs(expense).toFixed(2)}`;
  balanceEl.textContent = `$${balance.toFixed(2)}`;
}

function renderUI() {
  renderTransactions();
  renderSummary();
  renderChart(chartCanvas);
}

// Initial render
renderUI();
