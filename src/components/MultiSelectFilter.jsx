import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

export default function MultiSelectFilter({ label, options, selectedValues, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (val) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter(item => item !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const handleSelectAll = () => {
    onChange([]);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const filteredOptions = options.filter(opt =>
    String(opt.name || opt).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDisplayText = () => {
    if (!selectedValues || selectedValues.length === 0) return 'All';
    if (selectedValues.length === 1) {
      const val = selectedValues[0];
      return val.length > 14 ? val.substring(0, 12) + '...' : val;
    }
    return `${selectedValues.length} Selected`;
  };

  return (
    <div className="filter-field" ref={dropdownRef} style={{ position: 'relative' }}>
      <label className="filter-label">{label}</label>

      <button
        type="button"
        className="filter-select"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          background: selectedValues.length > 0 ? '#f0fdf4' : '#fcfbfa',
          borderColor: selectedValues.length > 0 ? '#16a34a' : '#d6cfc7',
          fontWeight: selectedValues.length > 0 ? '600' : 'normal',
          color: selectedValues.length > 0 ? '#15803d' : '#1c1917',
          textAlign: 'left'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {getDisplayText()}
        </span>
        <ChevronDown size={14} style={{ color: '#78716c', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
            marginTop: '0.25rem',
            width: options.length > 10 ? '220px' : '180px',
            maxHeight: '280px',
            background: '#ffffff',
            border: '1px solid #d6cfc7',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Quick actions header */}
          <div style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid #f0eae1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#faf8f5' }}>
            <button
              type="button"
              onClick={handleSelectAll}
              style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.72rem', cursor: 'pointer', fontWeight: '600' }}
            >
              Select All
            </button>
            {selectedValues.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.72rem', cursor: 'pointer', fontWeight: '600' }}
              >
                Reset
              </button>
            )}
          </div>

          {/* Search box inside dropdown if many options */}
          {options.length > 8 && (
            <div style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid #f0eae1' }}>
              <input
                type="text"
                placeholder="Filter items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.78rem',
                  border: '1px solid #e5e0d8',
                  borderRadius: '4px',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {/* Scrollable Checkbox list */}
          <div style={{ overflowY: 'auto', flexGrow: 1, padding: '0.25rem 0' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const optValue = typeof opt === 'object' ? opt.name : opt;
                const isSelected = selectedValues.includes(optValue);

                return (
                  <label
                    key={optValue}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                      color: isSelected ? '#4338ca' : '#1c1917',
                      fontWeight: isSelected ? '600' : 'normal'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleOption(optValue)}
                      style={{ cursor: 'pointer', accentColor: '#6366f1' }}
                    />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {optValue} {typeof opt === 'object' && opt.count !== undefined ? `(${opt.count})` : ''}
                    </span>
                  </label>
                );
              })
            ) : (
              <div style={{ padding: '0.6rem', fontSize: '0.78rem', color: '#78716c', textAlign: 'center' }}>
                No options match
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
