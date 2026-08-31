import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SeasonalDistChart({ seasonCounts, totalCount }) {
  const seasonLabels = [
    'Winter (Dec-Feb)',
    'Summer (Mar-May)',
    'Monsoon (Jun-Sep)',
    'Post-Monsoon (Oct-Nov)'
  ];

  const seasonColors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
  const counts = seasonLabels.map(s => seasonCounts[s] || 0);

  const data = {
    labels: ['Winter', 'Summer', 'Monsoon', 'Post-Monsoon'],
    datasets: [
      {
        data: counts,
        backgroundColor: seasonColors,
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
            return ` ${val.toLocaleString()} cases (${pct}%)`;
          }
        }
      }
    },
    cutout: '65%'
  };

  return (
    <div className="viz-card">
      <div className="viz-header">
        <div className="viz-title">Seasonal distribution</div>
        <div className="viz-subtitle">Winter (Dec–Feb) · Summer (Mar–May) · Monsoon (Jun–Sep) · Post-Monsoon (Oct–Nov)</div>
      </div>
      <div className="chart-box">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
