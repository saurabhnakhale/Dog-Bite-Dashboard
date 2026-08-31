import React from 'react';

export default function ZoneSeasonHeatmap({ zoneSeasonMatrix, zonesList }) {
  const seasons = [
    'Winter (Dec-Feb)',
    'Summer (Mar-May)',
    'Monsoon (Jun-Sep)',
    'Post-Monsoon (Oct-Nov)'
  ];

  const topZones = zonesList
    .filter(z => z.name !== 'Unspecified Zone')
    .slice(0, 7)
    .map(z => z.name);

  // Find max value in matrix for scaling color opacity
  let maxCount = 1;
  topZones.forEach(z => {
    seasons.forEach(s => {
      const val = zoneSeasonMatrix[z]?.[s] || 0;
      if (val > maxCount) maxCount = val;
    });
  });

  const getCellBgColor = (count) => {
    if (!count || count === 0) return 'rgba(241, 245, 249, 0.6)';
    const ratio = Math.min(count / maxCount, 1);
    // Gradient from light purple/indigo to dark indigo
    if (ratio > 0.7) return '#4338ca';
    if (ratio > 0.4) return '#6366f1';
    if (ratio > 0.15) return '#818cf8';
    return '#c7d2fe';
  };

  const getCellTextColor = (count) => {
    if (!count || count === 0) return '#94a3b8';
    const ratio = count / maxCount;
    return ratio > 0.4 ? '#ffffff' : '#1e1b4b';
  };

  return (
    <div className="viz-card">
      <div className="viz-header">
        <div className="viz-title">Zone x Season heatmap</div>
        <div className="viz-subtitle">Darker cells = more cases. Rows = zone, columns = season.</div>
      </div>

      <div style={{ overflowX: 'auto', flexGrow: 1 }}>
        <table className="heatmap-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Zone</th>
              {seasons.map(s => (
                <th key={s}>{s.split(' ')[0]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topZones.map(zone => (
              <tr key={zone}>
                <td className="heatmap-zone-label">
                  {zone.replace(/ \(Zone \d+\)/, '')}
                </td>
                {seasons.map(season => {
                  const count = zoneSeasonMatrix[zone]?.[season] || 0;
                  return (
                    <td
                      key={season}
                      style={{
                        backgroundColor: getCellBgColor(count),
                        color: getCellTextColor(count)
                      }}
                      title={`${zone} during ${season}: ${count.toLocaleString()} cases`}
                    >
                      {count > 0 ? count.toLocaleString() : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
