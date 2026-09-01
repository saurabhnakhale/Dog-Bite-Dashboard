import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from './components/FilterBar';
import MonthlyTrendChart from './components/MonthlyTrendChart';
import SeasonalDistChart from './components/SeasonalDistChart';
import AgeBySexChart from './components/AgeBySexChart';
import SexDistChart from './components/SexDistChart';
import TopWardsChart from './components/TopWardsChart';
import ZoneSeasonHeatmap from './components/ZoneSeasonHeatmap';
import PatientTable from './components/PatientTable';
import { fetchDogBiteData } from './services/dataService';
import Papa from 'papaparse';
import { Download, RefreshCw, LayoutGrid, Calendar, Sun, Users, PieChart, MapPin, Grid } from 'lucide-react';

export default function App() {
  const [allData, setAllData] = useState([]);
  const [dataMeta, setDataMeta] = useState({ source: 'Loading...', totalCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active view tab state: 'all' | 'monthly' | 'seasonal' | 'agesex' | 'sex' | 'wards' | 'heatmap'
  const [activeTab, setActiveTab] = useState('all');

  const [filters, setFilters] = useState({
    year: 'All',
    season: 'All',
    month: 'All',
    zone: 'All',
    ward: 'All',
    gender: 'All',
    ageGroup: 'All',
    search: '',
  });

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchDogBiteData();
      setAllData(res.data);
      setDataMeta({ source: res.source, totalCount: res.totalCount });
    } catch (err) {
      console.error('Failed to load dataset:', err);
      setError(err.message || 'Failed to load dataset');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered dataset computation
  const filteredData = useMemo(() => {
    return allData.filter(item => {
      if (filters.year !== 'All' && item.year !== filters.year) return false;
      if (filters.season !== 'All' && item.season !== filters.season) return false;
      if (filters.month !== 'All' && item.month !== filters.month) return false;
      if (filters.zone !== 'All' && item.zoneName !== filters.zone) return false;
      if (filters.ward !== 'All' && item.wardNo !== filters.ward) return false;
      if (filters.gender !== 'All' && item.gender !== filters.gender) return false;
      if (filters.ageGroup !== 'All' && item.ageGroup !== filters.ageGroup) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchName = item.patientName.toLowerCase().includes(q);
        const matchAddress = item.address.toLowerCase().includes(q);
        const matchWard = item.wardNo.toLowerCase().includes(q);
        const matchFacility = item.facilityName.toLowerCase().includes(q);
        const matchContact = item.contact.toLowerCase().includes(q);
        if (!matchName && !matchAddress && !matchWard && !matchFacility && !matchContact) {
          return false;
        }
      }

      return true;
    });
  }, [allData, filters]);

  // Derived filter options
  const filterOptions = useMemo(() => {
    const yearsMap = {};
    const monthsSet = new Set();
    const seasonsSet = new Set([
      'Winter (Dec-Feb)',
      'Summer (Mar-May)',
      'Monsoon (Jun-Sep)',
      'Post-Monsoon (Oct-Nov)'
    ]);
    const gendersSet = new Set();
    const ageGroupsSet = new Set();
    const zonesMap = {};
    const wardsMap = {};

    allData.forEach(r => {
      yearsMap[r.year] = (yearsMap[r.year] || 0) + 1;
      if (r.month && r.month !== 'Unknown') monthsSet.add(r.month);
      if (r.gender) gendersSet.add(r.gender);
      if (r.ageGroup && r.ageGroup !== 'Unknown') ageGroupsSet.add(r.ageGroup);
      if (r.zoneName) zonesMap[r.zoneName] = (zonesMap[r.zoneName] || 0) + 1;
      if (r.wardNo) wardsMap[r.wardNo] = (wardsMap[r.wardNo] || 0) + 1;
    });

    const monthsOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const sortedMonths = Array.from(monthsSet).sort((a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b));

    const years = Object.keys(yearsMap)
      .sort((a, b) => b.localeCompare(a))
      .map(y => ({ name: y, count: yearsMap[y] }));

    const zones = Object.keys(zonesMap)
      .map(z => ({ name: z, count: zonesMap[z] }))
      .sort((a, b) => b.count - a.count);

    const wards = Object.keys(wardsMap)
      .map(w => ({ name: w, count: wardsMap[w] }))
      .filter(w => w.name !== 'Unspecified Ward')
      .sort((a, b) => b.count - a.count);

    const ageGroupOrder = ['0-5', '6-12', '13-18', '19-35', '36-60', '60+'];
    const sortedAgeGroups = Array.from(ageGroupsSet).sort((a, b) => ageGroupOrder.indexOf(a) - ageGroupOrder.indexOf(b));

    return {
      years,
      months: sortedMonths,
      seasons: Array.from(seasonsSet),
      genders: Array.from(gendersSet),
      ageGroups: sortedAgeGroups,
      zones,
      wards,
    };
  }, [allData]);

  // Visual Analytics calculations
  const stats = useMemo(() => {
    const total = filteredData.length;
    const monthlyCounts = {};
    const seasonCounts = {};
    const genderCounts = {};
    const ageSexData = { male: {}, female: {} };
    const wardCounts = {};
    const yearlyTrends = { '2024': {}, '2025': {}, '2026': {} };
    const zoneSeasonMatrix = {};

    filteredData.forEach(r => {
      monthlyCounts[r.month] = (monthlyCounts[r.month] || 0) + 1;
      seasonCounts[r.season] = (seasonCounts[r.season] || 0) + 1;
      genderCounts[r.gender] = (genderCounts[r.gender] || 0) + 1;
      wardCounts[r.wardNo] = (wardCounts[r.wardNo] || 0) + 1;

      if (yearlyTrends[r.year]) {
        yearlyTrends[r.year][r.month] = (yearlyTrends[r.year][r.month] || 0) + 1;
      }

      // Age x Sex
      if (r.gender === 'Male') {
        ageSexData.male[r.ageGroup] = (ageSexData.male[r.ageGroup] || 0) + 1;
      } else if (r.gender === 'Female') {
        ageSexData.female[r.ageGroup] = (ageSexData.female[r.ageGroup] || 0) + 1;
      }

      // Zone x Season Matrix
      if (r.zoneName) {
        if (!zoneSeasonMatrix[r.zoneName]) zoneSeasonMatrix[r.zoneName] = {};
        zoneSeasonMatrix[r.zoneName][r.season] = (zoneSeasonMatrix[r.zoneName][r.season] || 0) + 1;
      }
    });

    const topWards = Object.keys(wardCounts)
      .map(w => ({ name: w, count: wardCounts[w] }))
      .sort((a, b) => b.count - a.count);

    return {
      total,
      monthlyCounts,
      seasonCounts,
      genderCounts,
      ageSexData,
      topWards,
      yearlyTrends,
      zoneSeasonMatrix,
    };
  }, [filteredData]);

  // CSV Export
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const exportRows = filteredData.map(r => ({
      Year: r.year,
      Month: r.month,
      Season: r.season,
      'Patient Name': r.patientName,
      'Contact Number': r.contact,
      Gender: r.gender,
      Age: r.ageStr || r.ageNum,
      'Patient Address': r.address,
      Area: r.area,
      'Date Of Onset': r.dateOfOnset,
      'Facility Name': r.facilityName,
      'Zone Name': r.zoneName,
      'Ward No.': r.wardNo,
    }));

    const csv = Papa.unparse(exportRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `dog_bites_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setFilters({
      year: 'All',
      season: 'All',
      month: 'All',
      zone: 'All',
      ward: 'All',
      gender: 'All',
      ageGroup: 'All',
      search: '',
    });
  };

  if (isLoading) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #e5e0d8', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        <h3 style={{ marginTop: '1.25rem', color: 'var(--text-main)' }}>Loading Dog Bite Analysis Dashboard...</h3>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div className="viz-card" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h3 style={{ color: '#ef4444' }}>Error Loading Data</h3>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error}</p>
          <button className="btn-clear" onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Centered Title & Subtitle Header with Right-side Live Stream & Actions */}
      <div className="header-container">
        {/* Empty left flex balance spacer */}
        <div style={{ flex: '1', display: 'none' }} className="desktop-spacer" />

        {/* Center Title and Subtitle */}
        <div className="header-center-title">
          <h1>Dog Bite Analysis Dashboard</h1>
          <p>As per NMC - IHIP Portal</p>
        </div>

        {/* Right Side: Live Stream Blinking Dot Indicator + Refresh & Export Buttons */}
        <div className="header-right-actions">
          <div className="live-stream-badge">
            <span className="blinking-dot" />
            <span>Live Stream</span>
          </div>

          <button className="btn-clear" onClick={loadData} title="Refresh Live Google Sheets Data">
            <RefreshCw size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Refresh
          </button>
          <button className="btn-clear" onClick={handleExportCSV} style={{ background: '#1c1917', color: '#ffffff', borderColor: '#1c1917' }}>
            <Download size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        years={filterOptions.years}
        months={filterOptions.months}
        seasons={filterOptions.seasons}
        genders={filterOptions.genders}
        ageGroups={filterOptions.ageGroups}
        zones={filterOptions.zones}
        wards={filterOptions.wards}
        onReset={handleResetFilters}
      />

      {/* Visualization Tab Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button
          className="btn-clear"
          style={activeTab === 'all' ? { background: '#1c1917', color: '#ffffff', borderColor: '#1c1917' } : {}}
          onClick={() => setActiveTab('all')}
        >
          <LayoutGrid size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> All Visualizations
        </button>

        <button
          className="btn-clear"
          style={activeTab === 'monthly' ? { background: '#1c1917', color: '#ffffff', borderColor: '#1c1917' } : {}}
          onClick={() => setActiveTab('monthly')}
        >
          <Calendar size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Line Trend (Monthly & Yearly)
        </button>

        <button
          className="btn-clear"
          style={activeTab === 'seasonal' ? { background: '#1c1917', color: '#ffffff', borderColor: '#1c1917' } : {}}
          onClick={() => setActiveTab('seasonal')}
        >
          <Sun size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Seasonal Distribution
        </button>

        <button
          className="btn-clear"
          style={activeTab === 'agesex' ? { background: '#1c1917', color: '#ffffff', borderColor: '#1c1917' } : {}}
          onClick={() => setActiveTab('agesex')}
        >
          <Users size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Age Distribution by Sex
        </button>

        <button
          className="btn-clear"
          style={activeTab === 'sex' ? { background: '#1c1917', color: '#ffffff', borderColor: '#1c1917' } : {}}
          onClick={() => setActiveTab('sex')}
        >
          <PieChart size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Sex Distribution
        </button>

        <button
          className="btn-clear"
          style={activeTab === 'wards' ? { background: '#1c1917', color: '#ffffff', borderColor: '#1c1917' } : {}}
          onClick={() => setActiveTab('wards')}
        >
          <MapPin size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Top Wards
        </button>

        <button
          className="btn-clear"
          style={activeTab === 'heatmap' ? { background: '#1c1917', color: '#ffffff', borderColor: '#1c1917' } : {}}
          onClick={() => setActiveTab('heatmap')}
        >
          <Grid size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Zone x Season Heatmap
        </button>
      </div>

      {/* Render selected Visualization(s) */}
      {activeTab === 'all' && (
        <>
          <div className="grid-2col">
            <MonthlyTrendChart
              monthlyCounts={stats.monthlyCounts}
              yearlyTrends={stats.yearlyTrends}
              onSelectMonth={(month) => setFilters(prev => ({ ...prev, month }))}
            />
            <SeasonalDistChart
              seasonCounts={stats.seasonCounts}
              totalCount={stats.total}
            />
          </div>

          <div className="grid-2col">
            <AgeBySexChart ageSexData={stats.ageSexData} />
            <SexDistChart genderCounts={stats.genderCounts} totalCount={stats.total} />
          </div>

          <div className="grid-2col">
            <TopWardsChart wardsData={stats.topWards} />
            <ZoneSeasonHeatmap
              zoneSeasonMatrix={stats.zoneSeasonMatrix}
              zonesList={filterOptions.zones}
            />
          </div>
        </>
      )}

      {/* Separate View 1: Line Trend (Monthly & Yearly) */}
      {activeTab === 'monthly' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <MonthlyTrendChart
            monthlyCounts={stats.monthlyCounts}
            yearlyTrends={stats.yearlyTrends}
            onSelectMonth={(month) => setFilters(prev => ({ ...prev, month }))}
          />
        </div>
      )}

      {/* Separate View 2: Seasonal Distribution */}
      {activeTab === 'seasonal' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <SeasonalDistChart
            seasonCounts={stats.seasonCounts}
            totalCount={stats.total}
          />
        </div>
      )}

      {/* Separate View 3: Age Distribution by Sex */}
      {activeTab === 'agesex' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <AgeBySexChart ageSexData={stats.ageSexData} />
        </div>
      )}

      {/* Separate View 4: Sex Distribution */}
      {activeTab === 'sex' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <SexDistChart genderCounts={stats.genderCounts} totalCount={stats.total} />
        </div>
      )}

      {/* Separate View 5: Top Wards by Case Count */}
      {activeTab === 'wards' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <TopWardsChart wardsData={stats.topWards} />
        </div>
      )}

      {/* Separate View 6: Zone x Season Heatmap */}
      {activeTab === 'heatmap' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <ZoneSeasonHeatmap
            zoneSeasonMatrix={stats.zoneSeasonMatrix}
            zonesList={filterOptions.zones}
          />
        </div>
      )}

      {/* Patient Records Explorer Table */}
      <PatientTable data={filteredData} />
    </div>
  );
}
