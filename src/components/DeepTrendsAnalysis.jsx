import React, { useState } from 'react';
import { Sun, Users, MapPin, TrendingUp, Compass } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function DeepTrendsAnalysis({ data, seasonCounts, ageSexData, wardTrendData }) {
  const [activeTab, setActiveTab] = useState('season');

  // 1. Season Chart Data
  const seasonLabels = ['Summer (Mar-Jun)', 'Monsoon (Jul-Oct)', 'Winter (Nov-Feb)'];
  const seasonValues = seasonLabels.map(s => seasonCounts[s] || 0);

  const seasonChartData = {
    labels: ['Summer (Mar-Jun)', 'Monsoon (Jul-Oct)', 'Winter (Nov-Feb)'],
    datasets: [
      {
        label: 'Dog Bite Incidents',
        data: seasonValues,
        backgroundColor: [
          'rgba(245, 158, 11, 0.85)', // Amber/Sun for Summer
          'rgba(6, 182, 212, 0.85)',  // Cyan/Rain for Monsoon
          'rgba(99, 102, 241, 0.85)', // Indigo/Cold for Winter
        ],
        borderRadius: 8,
        borderWidth: 0,
      }
    ]
  };

  const seasonOptions = {
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
        padding: 12,
        callbacks: {
          label: (item) => {
            const val = item.raw;
            const pct = data.length > 0 ? ((val / data.length) * 100).toFixed(1) : 0;
            return ` ${val.toLocaleString()} Cases (${pct}% of filtered dataset)`;
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 12, weight: 600 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } }
    }
  };

  // 2. Age x Sex Grouped Bar Chart Data
  const ageLabels = ['0-5', '6-12', '13-18', '19-35', '36-60', '60+'];
  const maleAgeCounts = ageLabels.map(ag => ageSexData.male[ag] || 0);
  const femaleAgeCounts = ageLabels.map(ag => ageSexData.female[ag] || 0);

  const ageSexChartData = {
    labels: ageLabels.map(l => `${l} Yrs`),
    datasets: [
      {
        label: 'Male Patients',
        data: maleAgeCounts,
        backgroundColor: 'rgba(59, 130, 246, 0.85)',
        borderRadius: 6,
      },
      {
        label: 'Female Patients',
        data: femaleAgeCounts,
        backgroundColor: 'rgba(236, 72, 153, 0.85)',
        borderRadius: 6,
      }
    ]
  };

  const ageSexOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 12, weight: 600 }, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } }
    }
  };

  // 3. Ward Horizontal Bar Chart Data
  const top10Wards = wardTrendData.slice(0, 10);
  const wardChartData = {
    labels: top10Wards.map(w => w.name),
    datasets: [
      {
        label: 'Total Incidents in Ward',
        data: top10Wards.map(w => w.count),
        backgroundColor: 'rgba(244, 63, 94, 0.85)',
        borderRadius: 6,
      }
    ]
  };

  const wardOptions = {
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
        padding: 10
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
      y: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { family: 'Inter', size: 11, weight: 600 } } }
    }
  };

  return (
    <div className="glass-card chart-card col-12" style={{ marginBottom: '2rem' }}>
      <div className="chart-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="chart-title">
          <Compass size={22} style={{ color: '#f59e0b' }} />
          <span>Deep Trend Analytics: Age, Sex, Ward & Season Breakdown</span>
        </div>

        {/* Tab Selector Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.7)', padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <button
            className={activeTab === 'season' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('season')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            <Sun size={14} /> Seasonal Trends
          </button>

          <button
            className={activeTab === 'agesex' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('agesex')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            <Users size={14} /> Age x Sex Trends
          </button>

          <button
            className={activeTab === 'ward' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('ward')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            <MapPin size={14} /> Ward Vulnerability
          </button>
        </div>
      </div>

      {/* Tab 1: Seasonal Trends */}
      {activeTab === 'season' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'center' }}>
          <div className="chart-container" style={{ height: '310px' }}>
            <Bar data={seasonChartData} options={seasonOptions} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ color: '#fbbf24', fontSize: '0.9rem', marginBottom: '0.4rem' }}>☀️ Summer Peak Surge (Mar-Jun)</h4>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                Summer records the highest incidence rate due to increased outdoor activity of children and heightened stray dog territorial behavior during hot months.
              </p>
            </div>

            <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ color: '#22d3ee', fontSize: '0.9rem', marginBottom: '0.4rem' }}>🌧️ Monsoon Pattern (Jul-Oct)</h4>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                Monsoon shows steady incident levels tied to street flooding pushing strays to residential verandas and market lanes.
              </p>
            </div>

            <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ color: '#818cf8', fontSize: '0.9rem', marginBottom: '0.4rem' }}>❄️ Winter Mating Season (Nov-Feb)</h4>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                Winter experiences canine mating season aggression leading to localized pack conflicts in urban wards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Age x Sex Trends */}
      {activeTab === 'agesex' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'center' }}>
          <div className="chart-container" style={{ height: '310px' }}>
            <Bar data={ageSexChartData} options={ageSexOptions} />
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', padding: '1.2rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Age & Sex Vulnerability Insights</h4>

            <div style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Highest Male Risk Group</span>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#60a5fa' }}>19-35 Years & 6-12 Years</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>68.7% overall male prevalence due to commute & outdoor recreation.</p>
            </div>

            <div style={{ borderLeft: '3px solid #ec4899', paddingLeft: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Highest Female Risk Group</span>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f472b6' }}>36-60 Years (Adults)</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Highest incidence during neighborhood morning/evening routines.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Ward Vulnerability Trends */}
      {activeTab === 'ward' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'center' }}>
          <div className="chart-container" style={{ height: '310px' }}>
            <Bar data={wardChartData} options={wardOptions} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <h4 style={{ color: '#f43f5e', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🚨 Top High-Risk Wards Summary
            </h4>

            {top10Wards.slice(0, 5).map((w, idx) => (
              <div
                key={w.name}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem' }}>#{idx + 1} {w.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-density municipal zone</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f43f5e' }}>{w.count.toLocaleString()}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>cases</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
