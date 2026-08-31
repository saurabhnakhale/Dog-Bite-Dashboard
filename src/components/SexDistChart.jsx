import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SexDistChart({ genderCounts, totalCount }) {
  const labels = Object.keys(genderCounts);
  const counts = Object.values(genderCounts);
  const colors = ['#3b82f6', '#ec4899', '#f59e0b', '#a8a29e'];

  const data = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#44403c',
          font: { family: 'Inter', size: 12 },
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(28, 25, 23, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e7e5e4',
        padding: 10,
        callbacks: {
          label: (item) => {
            const val = item.raw;
            const pct = totalCount > 0 ? ((val / totalCount) * 100).toFixed(1) : 0;
            return ` ${item.label}: ${val.toLocaleString()} cases (${pct}%)`;
          }
        }
      }
    },
    cutout: '65%'
  };

  return (
    <div className="viz-card">
      <div className="viz-header">
        <div className="viz-title">Sex distribution</div>
        <div className="viz-subtitle">Share of all recorded cases.</div>
      </div>
      <div className="chart-box">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
