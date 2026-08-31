import React from 'react';
import { MapPin, ShieldAlert } from 'lucide-react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function ZonesWardsView({ topZones, topWards, totalCount }) {
  const filteredZones = topZones.filter(z => z.name !== 'Unspecified Zone').slice(0, 8);
  const filteredWards = topWards.filter(w => w.name !== 'Unspecified Ward').slice(0, 6);

  const zoneChartData = {
    labels: filteredZones.map(z => z.name.replace(/ \(Zone \d+\)/, '')),
    datasets: [
      {
        label: 'Zone Incidents',
        data: filteredZones.map(z => z.count),
        backgroundColor: 'rgba(6, 182, 212, 0.85)',
        borderRadius: 6,
        borderWidth: 0
      }
    ]
  };

  const zoneOptions = {
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
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }
      }
    }
  };

  return (
    <div className="glass-card chart-card col-6">
      <div className="chart-header">
        <div className="chart-title">
          <MapPin size={18} style={{ color: '#06b6d4' }} />
          <span>Zone & Ward Hotspot Analysis</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Zone chart */}
        <div className="chart-container" style={{ height: '170px' }}>
          <Bar data={zoneChartData} options={zoneOptions} />
        </div>

        {/* High Risk Wards grid */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldAlert size={14} style={{ color: '#f43f5e' }} />
            <span>TOP HIGH-RISK WARDS RECORDED</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            {filteredWards.map((w, idx) => (
              <div
                key={w.name}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.8rem',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  #{idx + 1} {w.name}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#06b6d4', marginTop: '0.2rem' }}>
                  {w.count.toLocaleString()} <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 'normal' }}>cases</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
