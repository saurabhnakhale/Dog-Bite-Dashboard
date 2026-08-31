import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function TopWardsChart({ wardsData }) {
  const mappedWards = wardsData.filter(w => w.name && w.name !== 'Unspecified Ward').slice(0, 8);

  const data = {
    labels: mappedWards.map(w => w.name),
    datasets: [
      {
        label: 'Cases',
        data: mappedWards.map(w => w.count),
        backgroundColor: '#06b6d4',
        borderRadius: 4,
      }
    ]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(28, 25, 23, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e7e5e4',
        padding: 10,
        callbacks: {
          label: (item) => ` ${item.raw.toLocaleString()} cases recorded`
        }
      }
    },
    scales: {
      x: { grid: { color: '#f0eae1' }, ticks: { color: '#78716c', font: { family: 'Inter', size: 11 } } },
      y: { grid: { display: false }, ticks: { color: '#1c1917', font: { family: 'Inter', size: 11, weight: 600 } } }
    }
  };

  return (
    <div className="viz-card">
      <div className="viz-header">
        <div className="viz-title">Top wards by case count</div>
        <div className="viz-subtitle">Only cases with a mapped Ward No. are shown here.</div>
      </div>
      <div className="chart-box">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
