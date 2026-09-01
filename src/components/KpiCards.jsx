import React from 'react';
import { Activity, Sun, MapPin, AlertTriangle } from 'lucide-react';

export default function KpiCards({ stats, filteredData }) {
  // 1. Total Cases
  const totalCases = stats.total;

  // 2. Highest Season
  let topSeason = { name: 'N/A', count: 0 };
  Object.keys(stats.seasonCounts || {}).forEach((season) => {
    if (stats.seasonCounts[season] > topSeason.count) {
      topSeason = { name: season, count: stats.seasonCounts[season] };
    }
  });

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

  // 4. No. of Deaths (Calculated by NMC vs Outside jurisdiction)
  let totalDeaths = 0;
  let nmcDeaths = 0;
  let outsideDeaths = 0;

  if (filteredData && filteredData.length > 0) {
    filteredData.forEach((r) => {
      if (r.deathCategory === 'NMC') {
        nmcDeaths++;
        totalDeaths++;
      } else if (r.deathCategory === 'Outside') {
        outsideDeaths++;
        totalDeaths++;
      } else if (r.isDeath) {
        totalDeaths++;
      }
    });
  }

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
          Total reported incidents
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

      {/* KPI 4: No. of Deaths (Specified by NMC or Outside) */}
      <div className="viz-card" style={{ padding: '1.1rem 1.35rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            No. of Deaths
          </span>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} color="#ef4444" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: totalDeaths > 0 ? '#dc2626' : '#1c1917', lineHeight: '1.1' }}>
            {totalDeaths}
          </div>
          {totalDeaths > 0 && (
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#dc2626', background: '#fee2e2', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
              Fatality Case(s)
            </span>
          )}
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: nmcDeaths > 0 ? '700' : 'normal', color: nmcDeaths > 0 ? '#dc2626' : 'var(--text-muted)' }}>
            NMC: <strong>{nmcDeaths}</strong>
          </span>
          <span>•</span>
          <span style={{ fontWeight: outsideDeaths > 0 ? '700' : 'normal', color: outsideDeaths > 0 ? '#ea580c' : 'var(--text-muted)' }}>
            Outside: <strong>{outsideDeaths}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
