import React from 'react';
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
import { TrendingUp } from 'lucide-react';

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

export default function TrendsChart({ monthlyTrends }) {
  const monthsOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const datasets = [
    {
      label: '2024 Cases',
      data: monthsOrder.map(m => monthlyTrends['2024']?.[m] || 0),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      fill: true,
      tension: 0.35,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: '2025 Cases',
      data: monthsOrder.map(m => monthlyTrends['2025']?.[m] || 0),
      borderColor: '#ec4899',
      backgroundColor: 'rgba(236, 72, 153, 0.15)',
      fill: true,
      tension: 0.35,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: '2026 Cases',
      data: monthsOrder.map(m => monthlyTrends['2026']?.[m] || 0),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      fill: true,
      tension: 0.35,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
    }
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12, weight: 600 },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
      }
    }
  };

  return (
    <div className="glass-card chart-card col-12">
      <div className="chart-header">
        <div className="chart-title">
          <TrendingUp size={20} style={{ color: '#6366f1' }} />
          <span>Monthly Dog Bite Trends (Yearly Comparison)</span>
        </div>
      </div>
      <div className="chart-container" style={{ height: '340px' }}>
        <Line data={{ labels: monthsOrder.map(m => m.substring(0, 3)), datasets }} options={options} />
      </div>
    </div>
  );
}
