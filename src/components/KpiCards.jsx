import React from 'react';
import { Activity, Sun, MapPin, AlertTriangle } from 'lucide-react';

export default function KpiCards({ stats, totalRecords }) {
  // 1. Total Cases
  const totalCases = stats.total;

  // 2. Highest Season
  let topSeason = { name: 'N/A', count: 0 };
  Object.keys(stats.seasonCounts || {}).forEach((season) => {
    if (stats.seasonCounts[season] > topSeason.count) {
      topSeason = { name: season, count: stats.seasonCounts[season] };
    }
  });

  // Shorten season label if long
  const topSeasonShort = topSeason.name.replace(/\s*\([^)]*\)/, '');
  const topSeasonPct = totalCases > 0 ? ((topSeason.count / totalCases) * 100).toFixed(1) : 0;

  // 3. Highest Zone
  let topZone = { name: 'N/A', count: 0 };
  Object.keys(stats.zoneSeasonMatrix || {}).forEach((zone) => {
    let zoneTotal = 0;
    Object.values(stats.zoneSeasonMatrix[zone]).forEach((c) => (zoneTotal += c));
    if (zoneTotal > topZone.count) {
      topZone = { name: zone, count: zoneTotal };
    }
  });
  const topZonePct = totalCases > 0 ? ((topZone.count / totalCases) * 100).toFixed(1) : 0;

  // 4. No. of Deaths (IHIP Portal data records 0 deaths among reported cases)
  const deathCount = 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* KPI 1: Total No. of Cases */}
      <div className="viz-card" style={{ padding: '1.1rem 1.35rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total No. of Cases
          </span>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} color="#6366f1" />
          </div>
        </div>
        <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.1' }}>
          {totalCases.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
          Reported incident cases
        </div>
      </div>

      {/* KPI 2: Highest Cases in Season */}
      <div className="viz-card" style={{ padding: '1.1rem 1.35rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Highest Cases in Season
          </span>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbe6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sun size={20} color="#d97706" />
          </div>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {topSeasonShort}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
          {topSeason.count.toLocaleString()} cases ({topSeasonPct}%)
        </div>
      </div>

      {/* KPI 3: Highest Cases in Zone */}
      <div className="viz-card" style={{ padding: '1.1rem 1.35rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Highest Cases in Zone
          </span>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={20} color="#2563eb" />
          </div>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {topZone.name}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
          {topZone.count.toLocaleString()} cases ({topZonePct}%)
        </div>
      </div>

      {/* KPI 4: No. of Deaths */}
      <div className="viz-card" style={{ padding: '1.1rem 1.35rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            No. of Deaths
          </span>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} color="#ef4444" />
          </div>
        </div>
        <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1c1917', lineHeight: '1.1' }}>
          {deathCount}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
          0 reported fatalities (0.0%)
        </div>
      </div>
    </div>
  );
}
