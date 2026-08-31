import React from 'react';

export default function FilterBar({
  filters,
  setFilters,
  years,
  months,
  seasons,
  genders,
  ageGroups,
  zones,
  wards,
  onReset
}) {
  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="filter-card">
      <div className="filter-row">
        <div className="filter-field">
          <label className="filter-label">YEAR</label>
          <select className="filter-select" value={filters.year} onChange={(e) => handleChange('year', e.target.value)}>
            <option value="All">All</option>
            {years.map(y => (
              <option key={y.name} value={y.name}>{y.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label className="filter-label">SEASON</label>
          <select className="filter-select" value={filters.season} onChange={(e) => handleChange('season', e.target.value)}>
            <option value="All">All</option>
            {seasons.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label className="filter-label">MONTH</label>
          <select className="filter-select" value={filters.month} onChange={(e) => handleChange('month', e.target.value)}>
            <option value="All">All</option>
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label className="filter-label">ZONE</label>
          <select className="filter-select" value={filters.zone} onChange={(e) => handleChange('zone', e.target.value)}>
            <option value="All">All</option>
            {zones.map(z => (
              <option key={z.name} value={z.name}>{z.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label className="filter-label">WARD</label>
          <select className="filter-select" value={filters.ward} onChange={(e) => handleChange('ward', e.target.value)}>
            <option value="All">All</option>
            {wards.map(w => (
              <option key={w.name} value={w.name}>{w.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label className="filter-label">SEX</label>
          <select className="filter-select" value={filters.gender} onChange={(e) => handleChange('gender', e.target.value)}>
            <option value="All">All</option>
            {genders.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label className="filter-label">AGE BAND</label>
          <select className="filter-select" value={filters.ageGroup} onChange={(e) => handleChange('ageGroup', e.target.value)}>
            <option value="All">All</option>
            {ageGroups.map(ag => (
              <option key={ag} value={ag}>{ag}</option>
            ))}
          </select>
        </div>

        <div className="filter-field wide">
          <label className="filter-label">SEARCH NAME/ADDRESS</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Type to search..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        <button className="btn-clear" onClick={onReset}>
          Clear filters
        </button>
      </div>
    </div>
  );
}
