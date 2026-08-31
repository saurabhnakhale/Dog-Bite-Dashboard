import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Users, PieChart } from 'lucide-react';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DemographicsChart({ genderData, ageGroupData }) {
  const genderChartData = {
    labels: Object.keys(genderData),
    datasets: [
      {
        data: Object.values(genderData),
        backgroundColor: ['#3b82f6', '#ec4899', '#f59e0b', '#64748b'],
        borderColor: '#151d30',
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 },
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 10
      }
    },
    cutout: '68%'
  };

  const ageLabels = [
    '0-5 (Toddler)',
    '6-12 (Child)',
    '13-18 (Teen)',
    '19-35 (Young Adult)',
    '36-60 (Adult)',
    '60+ (Senior)',
    'Unknown'
  ];

  const ageCounts = ageLabels.map(label => ageGroupData[label] || 0);

  const ageChartData = {
    labels: ['0-5', '6-12', '13-18', '19-35', '36-60', '60+', 'Unk'],
    datasets: [
      {
        label: 'Incident Cases',
        data: ageCounts,
        backgroundColor: [
          'rgba(244, 63, 94, 0.85)',
          'rgba(249, 115, 22, 0.85)',
          'rgba(234, 179, 8, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(59, 130, 246, 0.85)',
          'rgba(168, 85, 247, 0.85)',
          'rgba(100, 116, 139, 0.5)'
        ],
        borderRadius: 6,
        borderWidth: 0
      }
    ]
  };

  const ageOptions = {
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
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
      }
    }
  };

  return (
    <>
      <div className="glass-card chart-card col-4">
        <div className="chart-header">
          <div className="chart-title">
            <PieChart size={18} style={{ color: '#ec4899' }} />
            <span>Gender Breakdown</span>
          </div>
        </div>
        <div className="chart-container" style={{ height: '260px' }}>
          <Doughnut data={genderChartData} options={donutOptions} />
        </div>
      </div>

      <div className="glass-card chart-card col-8">
        <div className="chart-header">
          <div className="chart-title">
            <Users size={18} style={{ color: '#10b981' }} />
            <span>Age Distribution Breakdown</span>
          </div>
        </div>
        <div className="chart-container" style={{ height: '260px' }}>
          <Bar data={ageChartData} options={ageOptions} />
        </div>
      </div>
    </>
  );
}
