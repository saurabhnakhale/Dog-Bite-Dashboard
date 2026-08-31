import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MonthlyTrendChart({ monthlyCounts, yearlyTrends, weeklyCounts, onSelectMonth }) {
  // Mode: 'monthly' | 'yearly' | 'weekly'
  const [viewMode, setViewMode] = useState('monthly');

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

  // 1. Monthly Line Chart Data
  const monthlyDataPoints = monthsOrder.map(m => monthlyCounts[m] || 0);

  const monthlyDataset = {
    labels: monthsOrder.map(m => m.substring(0, 3)),
    datasets: [
      {
        label: 'Dog Bite Incidents',
        data: monthlyDataPoints,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        fill: true,
        tension: 0.38,
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#6366f1',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  // 2. Yearly Comparative Line Chart Data (2024 vs 2025 vs 2026)
  const yearlyDatasets = {
    labels: monthsOrder.map(m => m.substring(0, 3)),
    datasets: [
      {
        label: '2024 Line Trend',
        data: monthsOrder.map(m => yearlyTrends['2024']?.[m] || 0),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 4,
      },
      {
        label: '2025 Line Trend',
        data: monthsOrder.map(m => yearlyTrends['2025']?.[m] || 0),
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 4,
      },
      {
        label: '2026 Line Trend',
        data: monthsOrder.map(m => yearlyTrends['2026']?.[m] || 0),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 4,
      }
    ]
  };

  // 3. Weekly Line Chart Data
  const weekLabels = ['Week 1 (1-7)', 'Week 2 (8-14)', 'Week 3 (15-21)', 'Week 4 (22-28)', 'Week 5 (29-31)'];
  const weeklyDataPoints = weekLabels.map(w => weeklyCounts[w] || 0);

  const weeklyDataset = {
    labels: ['Week 1 (Days 1-7)', 'Week 2 (Days 8-14)', 'Week 3 (Days 15-21)', 'Week 4 (Days 22-28)', 'Week 5 (Days 29-31)'],
    datasets: [
      {
        label: 'Weekly Incident Count',
        data: weeklyDataPoints,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        fill: true,
        tension: 0.35,
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#f59e0b',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  const getActiveChartData = () => {
    if (viewMode === 'yearly') return yearlyDatasets;
    if (viewMode === 'weekly') return weeklyDataset;
    return monthlyDataset;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements && elements.length > 0 && viewMode === 'monthly') {
        const index = elements[0].index;
        const selectedMonth = monthsOrder[index];
        if (onSelectMonth) onSelectMonth(selectedMonth);
      }
    },
    plugins: {
      legend: {
        display: viewMode === 'yearly',
        position: 'top',
        labels: { color: '#44403c', font: { family: 'Inter', size: 11, weight: 600 }, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: 'rgba(28, 25, 23, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e7e5e4',
        padding: 12,
        boxPadding: 4,
        callbacks: {
          label: (item) => ` ${item.dataset.label || 'Cases'}: ${item.raw.toLocaleString()} incidents`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#78716c', font: { family: 'Inter', size: 11, weight: 600 } } },
      y: { grid: { color: '#f0eae1' }, ticks: { color: '#78716c', font: { family: 'Inter', size: 11 } } }
    }
  };

  return (
    <div className="viz-card">
      <div className="viz-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div className="viz-title">Incidents Trend Line Chart (Yearly, Monthly & Weekly)</div>
          <div className="viz-subtitle">
            {viewMode === 'monthly' && 'Monthly trend line colored by season. Click a point to filter.'}
            {viewMode === 'yearly' && 'Comparative yearly trend lines across 2024, 2025, and 2026.'}
            {viewMode === 'weekly' && 'Weekly incident trend curve across days of the month.'}
          </div>
        </div>

        {/* View Mode Granularity Toggle Buttons */}
        <div style={{ display: 'flex', gap: '0.35rem', background: '#f4f1ea', padding: '0.25rem', borderRadius: '8px', border: '1px solid #e5e0d8' }}>
          <button
            className="btn-clear"
            style={viewMode === 'monthly' ? { background: '#1c1917', color: '#ffffff', padding: '0.25rem 0.65rem', fontSize: '0.75rem' } : { padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
            onClick={() => setViewMode('monthly')}
          >
            Monthly
          </button>
          <button
            className="btn-clear"
            style={viewMode === 'yearly' ? { background: '#1c1917', color: '#ffffff', padding: '0.25rem 0.65rem', fontSize: '0.75rem' } : { padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
            onClick={() => setViewMode('yearly')}
          >
            Yearly
          </button>
          <button
            className="btn-clear"
            style={viewMode === 'weekly' ? { background: '#1c1917', color: '#ffffff', padding: '0.25rem 0.65rem', fontSize: '0.75rem' } : { padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
            onClick={() => setViewMode('weekly')}
          >
            Weekly
          </button>
        </div>
      </div>

      <div className="chart-box">
        <Line data={getActiveChartData()} options={options} />
      </div>
    </div>
  );
}
