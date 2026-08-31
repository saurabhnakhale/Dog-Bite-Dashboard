import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Building2 } from 'lucide-react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function FacilitiesChart({ topFacilities, totalCount }) {
  const top10 = topFacilities.slice(0, 10);
  
  // Truncate long names for chart labels
  const labels = top10.map(f => {
    let name = f.name;
    if (name.length > 30) name = name.substring(0, 27) + '...';
    return name;
  });

  const counts = top10.map(f => f.count);

  const data = {
    labels,
    datasets: [
      {
        label: 'Dog Bite Cases Handled',
        data: counts,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        hoverBackgroundColor: 'rgba(129, 140, 248, 0.95)',
        borderRadius: 6,
        borderWidth: 0
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
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          title: (items) => top10[items[0].dataIndex]?.name || '',
          label: (item) => {
            const val = item.raw;
            const pct = totalCount > 0 ? ((val / totalCount) * 100).toFixed(1) : 0;
            return ` ${val.toLocaleString()} Cases (${pct}% of filtered dataset)`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#cbd5e1', font: { family: 'Inter', size: 11, weight: 500 } }
      }
    }
  };

  return (
    <div className="glass-card chart-card col-6">
      <div className="chart-header">
        <div className="chart-title">
          <Building2 size={18} style={{ color: '#fbbf24' }} />
          <span>Top Healthcare Facilities Distribution</span>
        </div>
      </div>
      <div className="chart-container" style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
