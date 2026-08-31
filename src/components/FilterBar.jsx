import React from 'react';
import { Filter, Search, RotateCcw } from 'lucide-react';

export default function FilterBar({
  filters,
  setFilters,
  years,
  months,
  genders,
  ageGroups,
  zones,
  facilities,
  onReset
}) {
  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="glass-card filter-bar">
      <div className="filter-grid">
        <div className="filter-group">
          <label>Search Patient / Ward</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="text-input"
              placeholder="Search by name, address, ward..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              style={{ paddingLeft: '2rem' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          </div>
        </div>

        <div className="filter-group">
          <label>Year</label>
          <select className="select-input" value={filters.year} onChange={(e) => handleChange('year', e.target.value)}>
            <option value="All">All Years ({years.reduce((a, b) => a + b.count, 0)})</option>
            {years.map(y => (
              <option key={y.name} value={y.name}>{y.name} ({y.count})</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Month</label>
          <select className="select-input" value={filters.month} onChange={(e) => handleChange('month', e.target.value)}>
            <option value="All">All Months</option>
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Gender</label>
          <select className="select-input" value={filters.gender} onChange={(e) => handleChange('gender', e.target.value)}>
            <option value="All">All Genders</option>
            {genders.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Age Group</label>
          <select className="select-input" value={filters.ageGroup} onChange={(e) => handleChange('ageGroup', e.target.value)}>
            <option value="All">All Age Brackets</option>
            {ageGroups.map(ag => (
              <option key={ag} value={ag}>{ag}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Zone Name</label>
          <select className="select-input" value={filters.zone} onChange={(e) => handleChange('zone', e.target.value)}>
            <option value="All">All Zones</option>
            {zones.map(z => (
              <option key={z.name} value={z.name}>{z.name} ({z.count})</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Facility Name</label>
          <select className="select-input" value={filters.facility} onChange={(e) => handleChange('facility', e.target.value)}>
            <option value="All">All Facilities</option>
            {facilities.slice(0, 15).map(f => (
              <option key={f.name} value={f.name}>{f.name.length > 25 ? f.name.substring(0, 25) + '...' : f.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group" style={{ justifyContent: 'flex-end' }}>
          <label style={{ visibility: 'hidden' }}>Reset</label>
          <button className="btn-secondary" onClick={onReset} style={{ justifyContent: 'center' }}>
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
