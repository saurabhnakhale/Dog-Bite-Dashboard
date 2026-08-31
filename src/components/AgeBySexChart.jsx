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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AgeBySexChart({ ageSexData }) {
  const ageLabels = ['0-5', '6-12', '13-18', '19-35', '36-60', '60+'];
  const maleCounts = ageLabels.map(ag => ageSexData.male[ag] || 0);
  const femaleCounts = ageLabels.map(ag => ageSexData.female[ag] || 0);

  const data = {
    labels: ageLabels.map(l => `${l} yrs`),
    datasets: [
      {
        label: 'Male',
        data: maleCounts,
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
      {
        label: 'Female',
        data: femaleCounts,
        backgroundColor: '#ec4899',
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#44403c',
          font: { family: 'Inter', size: 12, weight: 600 },
          usePointStyle: true,
          padding: 12
        }
      },
      tooltip: {
        backgroundColor: 'rgba(28, 25, 23, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e7e5e4',
        padding: 10
      }
    },
    scales: {
      x: { stacked: true, grid: { display: false }, ticks: { color: '#78716c', font: { family: 'Inter', size: 11 } } },
      y: { stacked: true, grid: { color: '#f0eae1' }, ticks: { color: '#78716c', font: { family: 'Inter', size: 11 } } }
    }
  };

  return (
    <div className="viz-card">
      <div className="viz-header">
        <div className="viz-title">Age distribution by sex</div>
        <div className="viz-subtitle">Stacked age-band counts, split by sex.</div>
      </div>
      <div className="chart-box">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
