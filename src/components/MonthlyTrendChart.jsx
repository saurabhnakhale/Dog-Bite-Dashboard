import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getSeason } from '../services/dataService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MonthlyTrendChart({ monthlyCounts, onSelectMonth }) {
  const monthsOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const seasonColors = {
    'Winter (Dec-Feb)': '#3b82f6',
    'Summer (Mar-May)': '#f59e0b',
    'Monsoon (Jun-Sep)': '#10b981',
    'Post-Monsoon (Oct-Nov)': '#8b5cf6',
  };

  const bgColors = monthsOrder.map(m => {
    const s = getSeason(m);
    return seasonColors[s] || '#64748b';
  });

  const counts = monthsOrder.map(m => monthlyCounts[m] || 0);

  const data = {
    labels: monthsOrder.map(m => m.substring(0, 3)),
    datasets: [
      {
        label: 'Cases',
        data: counts,
        backgroundColor: bgColors,
        borderRadius: 6,
        borderWidth: 0,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        const selectedMonth = monthsOrder[index];
        if (onSelectMonth) onSelectMonth(selectedMonth);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(28, 25, 23, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e7e5e4',
        padding: 10,
        callbacks: {
          title: (items) => monthsOrder[items[0].dataIndex],
          label: (item) => {
            const m = monthsOrder[item.dataIndex];
            const s = getSeason(m);
            return ` ${item.raw.toLocaleString()} cases (${s})`;
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#78716c', font: { family: 'Inter', size: 11 } } },
      y: { grid: { color: '#f0eae1' }, ticks: { color: '#78716c', font: { family: 'Inter', size: 11 } } }
    }
  };

  return (
    <div className="viz-card">
      <div className="viz-header">
        <div className="viz-title">Monthly trend, coloured by season</div>
        <div className="viz-subtitle">Click a bar to filter the table below to that month.</div>
      </div>
      <div className="chart-box">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
