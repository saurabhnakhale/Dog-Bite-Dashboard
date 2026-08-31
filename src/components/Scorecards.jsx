import React from 'react';
import { Activity, Users, Building2, Calendar, AlertTriangle } from 'lucide-react';

export default function Scorecards({ stats, totalDatasetCount }) {
  const pctTotal = ((stats.filteredCount / (totalDatasetCount || 1)) * 100).toFixed(1);

  return (
    <div className="scorecards-grid">
      {/* Card 1: Total Cases */}
      <div className="glass-card scorecard">
        <div className="scorecard-header">
          <span className="scorecard-title">Total Dog Bite Cases</span>
          <div className="scorecard-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Activity size={20} />
          </div>
        </div>
        <div className="scorecard-value">{stats.filteredCount.toLocaleString()}</div>
        <div className="scorecard-subtitle">
          {pctTotal}% of total recorded registry ({totalDatasetCount.toLocaleString()} incidents)
        </div>
      </div>

      {/* Card 2: Gender Distribution */}
      <div className="glass-card scorecard">
        <div className="scorecard-header">
          <span className="scorecard-title">Gender Demographics</span>
          <div className="scorecard-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
            <Users size={20} />
          </div>
        </div>
        <div className="scorecard-value" style={{ fontSize: '1.75rem' }}>
          {stats.malePct}% M / {stats.femalePct}% F
        </div>
        <div className="scorecard-subtitle">
          Male: {stats.maleCount.toLocaleString()} • Female: {stats.femaleCount.toLocaleString()}
        </div>
        {/* Micro progress bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(236, 72, 153, 0.3)', borderRadius: '3px', marginTop: '0.6rem', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${stats.malePct}%`, background: '#3b82f6', height: '100%' }} />
          <div style={{ width: `${stats.femalePct}%`, background: '#ec4899', height: '100%' }} />
        </div>
      </div>

      {/* Card 3: Age Demographics */}
      <div className="glass-card scorecard">
        <div className="scorecard-header">
          <span className="scorecard-title">Most Affected Age Bracket</span>
          <div className="scorecard-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="scorecard-value" style={{ fontSize: '1.6rem' }}>{stats.topAgeBracket}</div>
        <div className="scorecard-subtitle">
          Average Patient Age: <strong style={{ color: 'var(--text-main)' }}>{stats.avgAge} Years</strong> ({stats.topAgeCount.toLocaleString()} cases)
        </div>
      </div>

      {/* Card 4: Top Facility */}
      <div className="glass-card scorecard">
        <div className="scorecard-header">
          <span className="scorecard-title">Primary Treatment Center</span>
          <div className="scorecard-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Building2 size={20} />
          </div>
        </div>
        <div className="scorecard-value" style={{ fontSize: '1.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {stats.topFacilityName}
        </div>
        <div className="scorecard-subtitle">
          Handled <strong style={{ color: '#fbbf24' }}>{stats.topFacilityCount.toLocaleString()}</strong> cases ({stats.topFacilityPct}% share)
        </div>
      </div>
    </div>
  );
}
