import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import MultiSelectFilter from './MultiSelectFilter';

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
  onReset,
}) {
  const hasActiveFilters =
    filters.year.length > 0 ||
    filters.season.length > 0 ||
    filters.month.length > 0 ||
    filters.zone.length > 0 ||
    filters.prabhag.length > 0 ||
    filters.gender.length > 0 ||
    filters.ageGroup.length > 0 ||
    filters.search !== '';

  return (
    <div className="filter-card">
      <div className="filter-row">
        {/* YEAR Multi-Select */}
        <MultiSelectFilter
          label="YEAR"
          options={years}
          selectedValues={filters.year}
          onChange={(val) => setFilters((prev) => ({ ...prev, year: val }))}
        />

        {/* SEASON Multi-Select */}
        <MultiSelectFilter
          label="SEASON"
          options={seasons}
          selectedValues={filters.season}
          onChange={(val) => setFilters((prev) => ({ ...prev, season: val }))}
        />

        {/* MONTH Multi-Select */}
        <MultiSelectFilter
          label="MONTH"
          options={months}
          selectedValues={filters.month}
          onChange={(val) => setFilters((prev) => ({ ...prev, month: val }))}
        />

        {/* ZONE Multi-Select */}
        <MultiSelectFilter
          label="ZONE"
          options={zones}
          selectedValues={filters.zone}
          onChange={(val) => setFilters((prev) => ({ ...prev, zone: val }))}
        />

        {/* PRABHAG (Renamed from WARD) Multi-Select */}
        <MultiSelectFilter
          label="PRABHAG"
          options={wards}
          selectedValues={filters.prabhag}
          onChange={(val) => setFilters((prev) => ({ ...prev, prabhag: val }))}
        />

        {/* SEX Multi-Select */}
        <MultiSelectFilter
          label="SEX"
          options={genders}
          selectedValues={filters.gender}
          onChange={(val) => setFilters((prev) => ({ ...prev, gender: val }))}
        />

        {/* AGE BAND Multi-Select */}
        <MultiSelectFilter
          label="AGE BAND"
          options={ageGroups}
          selectedValues={filters.ageGroup}
          onChange={(val) => setFilters((prev) => ({ ...prev, ageGroup: val }))}
        />

        {/* SEARCH NAME/ADDRESS Text Input */}
        <div className="filter-field wide">
          <label className="filter-label">SEARCH NAME/ADDRESS</label>
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '0.65rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#a8a29e',
              }}
            />
            <input
              type="text"
              className="filter-input"
              style={{ paddingLeft: '2rem' }}
              placeholder="Type to search..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            className="btn-clear"
            onClick={onReset}
            style={{
              background: '#fef2f2',
              borderColor: '#fca5a5',
              color: '#dc2626',
            }}
          >
            <RotateCcw size={13} style={{ display: 'inline', marginRight: '0.3rem' }} /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
