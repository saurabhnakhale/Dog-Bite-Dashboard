import React, { useState, useMemo } from 'react';
import { Database, ChevronLeft, ChevronRight, X, User, Phone, MapPin, Hospital, Calendar, Tag, AlertTriangle } from 'lucide-react';

export default function PatientTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className="viz-card data-table-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="viz-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={18} style={{ color: '#6366f1' }} />
          <span>Patient Incident Registry Explorer ({data.length.toLocaleString()} Records)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rows per page:</span>
          <select
            className="filter-select"
            style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID {sortField === 'id' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('dateOfOnset')} style={{ cursor: 'pointer' }}>Onset Date {sortField === 'dateOfOnset' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('patientName')} style={{ cursor: 'pointer' }}>Patient Name {sortField === 'patientName' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('ageNum')} style={{ cursor: 'pointer' }}>Age {sortField === 'ageNum' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('gender')} style={{ cursor: 'pointer' }}>Gender {sortField === 'gender' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('facilityName')} style={{ cursor: 'pointer' }}>Facility {sortField === 'facilityName' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('zoneName')} style={{ cursor: 'pointer' }}>Zone {sortField === 'zoneName' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('wardNo')} style={{ cursor: 'pointer' }}>Prabhag {sortField === 'wardNo' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('deathCategory')} style={{ cursor: 'pointer' }}>Death (NMC/Outside) {sortField === 'deathCategory' ? (sortAsc ? '↑' : '↓') : ''}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr key={row.id} onClick={() => setSelectedPatient(row)} title="Click to view detailed patient incident report">
                  <td style={{ color: 'var(--text-dim)' }}>#{row.id}</td>
                  <td style={{ fontWeight: '500' }}>{row.dateOfOnset || `${row.month} ${row.year}`}</td>
                  <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{row.patientName}</td>
                  <td>{row.ageStr || (row.ageNum !== null ? `${row.ageNum} Yrs` : 'N/A')}</td>
                  <td>
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: row.gender === 'Male' ? '#e0f2fe' : '#fce7f3',
                      color: row.gender === 'Male' ? '#0369a1' : '#be185d'
                    }}>
                      {row.gender}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-main)' }}>{row.facilityName.length > 28 ? row.facilityName.substring(0, 26) + '...' : row.facilityName}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{row.zoneName.replace(/ \(Zone \d+\)/, '')}</td>
                  <td>
                    <span style={{ padding: '0.15rem 0.5rem', background: '#f5f3ef', border: '1px solid #e5e0d8', borderRadius: '4px', fontSize: '0.75rem' }}>
                      {row.wardNo}
                    </span>
                  </td>
                  <td>
                    {row.deathCategory === 'NMC' ? (
                      <span style={{ background: '#fee2e2', color: '#dc2626', padding: '0.15rem 0.55rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <AlertTriangle size={11} /> NMC Death
                      </span>
                    ) : row.deathCategory === 'Outside' ? (
                      <span style={{ background: '#ffedd5', color: '#c2410c', padding: '0.15rem 0.55rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <AlertTriangle size={11} /> Outside Death
                      </span>
                    ) : (
                      <span style={{ color: '#a8a29e', fontSize: '0.78rem' }}>None</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No matching patient records found. Try adjusting your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-card)', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length.toLocaleString()} records
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn-clear"
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={14} style={{ display: 'inline' }} /> Prev
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', padding: '0 0.5rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn-clear"
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            Next <ChevronRight size={14} style={{ display: 'inline' }} />
          </button>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setSelectedPatient(null)}>
          <div className="viz-card" style={{ maxWidth: '520px', width: '100%', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button className="btn-clear" style={{ position: 'absolute', right: '1rem', top: '1rem', padding: '0.3rem' }} onClick={() => setSelectedPatient(null)}>
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>{selectedPatient.patientName}</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Record ID: #{selectedPatient.id} • NMC IHIP Incident Report</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Date of Onset</span>
                <strong>{selectedPatient.dateOfOnset || `${selectedPatient.month} ${selectedPatient.year}`}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Gender & Age</span>
                <strong>{selectedPatient.gender}, {selectedPatient.ageStr || `${selectedPatient.ageNum} Years`}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Contact Number</span>
                <strong>{selectedPatient.contact || 'Not Provided'}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Age Group Bracket</span>
                <strong>{selectedPatient.ageGroup}</strong>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Healthcare Facility</span>
                <strong style={{ color: '#d97706' }}>{selectedPatient.facilityName}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Zone Name</span>
                <strong>{selectedPatient.zoneName}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Prabhag / Ward</span>
                <strong>{selectedPatient.wardNo}</strong>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Death Status (NMC/Outside)</span>
                {selectedPatient.deathCategory === 'NMC' ? (
                  <span style={{ background: '#fee2e2', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                    <AlertTriangle size={13} /> NMC Death
                  </span>
                ) : selectedPatient.deathCategory === 'Outside' ? (
                  <span style={{ background: '#ffedd5', color: '#c2410c', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                    <AlertTriangle size={13} /> Outside Death
                  </span>
                ) : (
                  <strong style={{ color: '#16a34a' }}>No Fatality (Survivals)</strong>
                )}
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Patient Address / Location</span>
                <strong>{selectedPatient.address || selectedPatient.area || 'NMC Ward Record'}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
