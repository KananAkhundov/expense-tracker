import { transactions } from './data.js';

let chart;

export function renderChart(ctx) {
  const categoryTotals = {};

  transactions.forEach(t => {
    if (t.amount < 0) {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
    }
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#f39c12', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71'
        ]
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}
