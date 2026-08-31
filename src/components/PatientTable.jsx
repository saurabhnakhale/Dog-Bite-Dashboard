import React, { useState, useMemo } from 'react';
import { Database, ChevronLeft, ChevronRight, X, User, Phone, MapPin, Hospital, Calendar, Tag } from 'lucide-react';

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
    <div className="glass-card table-card">
      <div className="table-header-bar">
        <div className="chart-title">
          <Database size={20} style={{ color: '#818cf8' }} />
          <span>Patient Incident Registry Explorer ({data.length.toLocaleString()} Records)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rows per page:</span>
          <select
            className="select-input"
            style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
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

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID {sortField === 'id' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('dateOfOnset')}>Onset Date {sortField === 'dateOfOnset' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('patientName')}>Patient Name {sortField === 'patientName' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('ageNum')}>Age {sortField === 'ageNum' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('gender')}>Gender {sortField === 'gender' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('facilityName')}>Facility {sortField === 'facilityName' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('zoneName')}>Zone {sortField === 'zoneName' ? (sortAsc ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('wardNo')}>Ward {sortField === 'wardNo' ? (sortAsc ? '↑' : '↓') : ''}</th>
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
                    <span className={`gender-badge ${row.gender === 'Male' ? 'gender-male' : 'gender-female'}`}>
                      {row.gender}
                    </span>
                  </td>
                  <td style={{ color: '#cbd5e1' }}>{row.facilityName.length > 32 ? row.facilityName.substring(0, 30) + '...' : row.facilityName}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{row.zoneName.replace(/ \(Zone \d+\)/, '')}</td>
                  <td>
                    <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', fontSize: '0.75rem' }}>
                      {row.wardNo}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No matching patient records found. Try adjusting your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pagination-bar">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length.toLocaleString()} records
        </span>

        <div className="pagination-controls">
          <button
            className="page-btn"
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', padding: '0 0.5rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="page-btn"
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="glass-card modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedPatient(null)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                <User size={22} style={{ margin: 'auto' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'white' }}>{selectedPatient.patientName}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Record ID: #{selectedPatient.id} • NMC Incident Report</span>
              </div>
            </div>

            <div className="patient-detail-grid">
              <div className="detail-item">
                <span className="label"><Calendar size={12} inline /> Date of Onset</span>
                <span className="value">{selectedPatient.dateOfOnset || `${selectedPatient.month} ${selectedPatient.year}`}</span>
              </div>

              <div className="detail-item">
                <span className="label"><User size={12} inline /> Gender & Age</span>
                <span className="value">{selectedPatient.gender}, {selectedPatient.ageStr || `${selectedPatient.ageNum} Years`}</span>
              </div>

              <div className="detail-item">
                <span className="label"><Phone size={12} inline /> Contact Number</span>
                <span className="value">{selectedPatient.contact || 'Not Provided'}</span>
              </div>

              <div className="detail-item">
                <span className="label"><Tag size={12} inline /> Age Group Bracket</span>
                <span className="value">{selectedPatient.ageGroup}</span>
              </div>

              <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                <span className="label"><Hospital size={12} inline /> Assigned Healthcare Facility</span>
                <span className="value" style={{ color: '#fbbf24' }}>{selectedPatient.facilityName}</span>
              </div>

              <div className="detail-item">
                <span className="label"><MapPin size={12} inline /> Zone Name</span>
                <span className="value">{selectedPatient.zoneName}</span>
              </div>

              <div className="detail-item">
                <span className="label"><MapPin size={12} inline /> Ward Number</span>
                <span className="value">{selectedPatient.wardNo}</span>
              </div>

              <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                <span className="label"><MapPin size={12} inline /> Patient Address / Location</span>
                <span className="value">{selectedPatient.address || selectedPatient.area || 'NMC Ward Record'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
