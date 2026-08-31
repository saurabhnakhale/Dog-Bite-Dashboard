import React from 'react';
import { Dog, RefreshCw, Download, Activity } from 'lucide-react';

export default function Header({ source, onRefresh, onExport, totalRecords, filteredCount, isLoading }) {
  return (
    <header className="app-header">
      <div className="app-title-group">
        <div className="app-logo-badge">
          <Dog size={30} />
        </div>
        <div className="app-title-text">
          <h1>Nagpur Dog Bite Incident Analytics</h1>
          <p>Nagpur Municipal Corporation (NMC) Public Health Portal • {filteredCount.toLocaleString()} / {totalRecords.toLocaleString()} Incidents Filtered</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="sync-status-badge">
          <div className="sync-status-dot" />
          <span>{source}</span>
        </div>

        <button className="btn-secondary" onClick={onRefresh} disabled={isLoading} title="Refresh live data from Google Sheets">
          <RefreshCw size={16} className={isLoading ? 'spin-icon' : ''} />
          <span>Refresh</span>
        </button>

        <button className="btn-primary" onClick={onExport} title="Export filtered records to CSV">
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>
    </header>
  );
}
