import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import Scorecards from './components/Scorecards';
import TrendsChart from './components/TrendsChart';
import DemographicsChart from './components/DemographicsChart';
import FacilitiesChart from './components/FacilitiesChart';
import ZonesWardsView from './components/ZonesWardsView';
import PatientTable from './components/PatientTable';
import { fetchDogBiteData } from './services/dataService';
import Papa from 'papaparse';

export default function App() {
  const [allData, setAllData] = useState([]);
  const [dataMeta, setDataMeta] = useState({ source: 'Loading...', totalCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    year: 'All',
    month: 'All',
    gender: 'All',
    ageGroup: 'All',
    zone: 'All',
    facility: 'All',
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
      setError(err.message || 'Failed to load dog bite dataset');
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
      if (filters.month !== 'All' && item.month !== filters.month) return false;
      if (filters.gender !== 'All' && item.gender !== filters.gender) return false;
      if (filters.ageGroup !== 'All' && item.ageGroup !== filters.ageGroup) return false;
      if (filters.zone !== 'All' && item.zoneName !== filters.zone) return false;
      if (filters.facility !== 'All' && item.facilityName !== filters.facility) return false;

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

  // Derived unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const yearsMap = {};
    const monthsSet = new Set();
    const gendersSet = new Set();
    const ageGroupsSet = new Set();
    const zonesMap = {};
    const facilitiesMap = {};

    allData.forEach(r => {
      yearsMap[r.year] = (yearsMap[r.year] || 0) + 1;
      if (r.month && r.month !== 'Unknown') monthsSet.add(r.month);
      if (r.gender) gendersSet.add(r.gender);
      if (r.ageGroup) ageGroupsSet.add(r.ageGroup);
      if (r.zoneName) zonesMap[r.zoneName] = (zonesMap[r.zoneName] || 0) + 1;
      if (r.facilityName) facilitiesMap[r.facilityName] = (facilitiesMap[r.facilityName] || 0) + 1;
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

    const facilities = Object.keys(facilitiesMap)
      .map(f => ({ name: f, count: facilitiesMap[f] }))
      .sort((a, b) => b.count - a.count);

    return {
      years,
      months: sortedMonths,
      genders: Array.from(gendersSet),
      ageGroups: Array.from(ageGroupsSet),
      zones,
      facilities,
    };
  }, [allData]);

  // Comprehensive analytics calculations
  const stats = useMemo(() => {
    const total = filteredData.length;

    let maleCount = 0;
    let femaleCount = 0;
    let sumAge = 0;
    let ageCount = 0;

    const ageGroupCounts = {};
    const genderCounts = {};
    const facilityCounts = {};
    const zoneCounts = {};
    const wardCounts = {};
    const monthlyTrends = { '2024': {}, '2025': {}, '2026': {} };

    filteredData.forEach(r => {
      if (r.gender === 'Male') maleCount++;
      else if (r.gender === 'Female') femaleCount++;

      genderCounts[r.gender] = (genderCounts[r.gender] || 0) + 1;

      if (r.ageNum !== null) {
        sumAge += r.ageNum;
        ageCount++;
      }

      ageGroupCounts[r.ageGroup] = (ageGroupCounts[r.ageGroup] || 0) + 1;
      facilityCounts[r.facilityName] = (facilityCounts[r.facilityName] || 0) + 1;
      zoneCounts[r.zoneName] = (zoneCounts[r.zoneName] || 0) + 1;
      wardCounts[r.wardNo] = (wardCounts[r.wardNo] || 0) + 1;

      if (monthlyTrends[r.year]) {
        monthlyTrends[r.year][r.month] = (monthlyTrends[r.year][r.month] || 0) + 1;
      }
    });

    const malePct = total > 0 ? ((maleCount / total) * 100).toFixed(1) : 0;
    const femalePct = total > 0 ? ((femaleCount / total) * 100).toFixed(1) : 0;
    const avgAge = ageCount > 0 ? (sumAge / ageCount).toFixed(1) : 'N/A';

    // Top Age Bracket
    let topAgeBracket = 'N/A';
    let topAgeCount = 0;
    Object.entries(ageGroupCounts).forEach(([grp, count]) => {
      if (count > topAgeCount && grp !== 'Unknown') {
        topAgeCount = count;
        topAgeBracket = grp;
      }
    });

    // Top Facility
    let topFacilityName = 'None';
    let topFacilityCount = 0;
    Object.entries(facilityCounts).forEach(([fac, count]) => {
      if (count > topFacilityCount) {
        topFacilityCount = count;
        topFacilityName = fac;
      }
    });
    const topFacilityPct = total > 0 ? ((topFacilityCount / total) * 100).toFixed(1) : 0;

    // Ranked list of facilities, zones, wards
    const topFacilities = Object.keys(facilityCounts)
      .map(f => ({ name: f, count: facilityCounts[f] }))
      .sort((a, b) => b.count - a.count);

    const topZones = Object.keys(zoneCounts)
      .map(z => ({ name: z, count: zoneCounts[z] }))
      .sort((a, b) => b.count - a.count);

    const topWards = Object.keys(wardCounts)
      .map(w => ({ name: w, count: wardCounts[w] }))
      .sort((a, b) => b.count - a.count);

    return {
      filteredCount: total,
      maleCount,
      femaleCount,
      malePct,
      femalePct,
      avgAge,
      topAgeBracket,
      topAgeCount,
      topFacilityName,
      topFacilityCount,
      topFacilityPct,
      genderCounts,
      ageGroupCounts,
      monthlyTrends,
      topFacilities,
      topZones,
      topWards,
    };
  }, [filteredData]);

  // CSV Export
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const exportRows = filteredData.map(r => ({
      Year: r.year,
      Month: r.month,
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
    link.setAttribute('download', `nagpur_dog_bites_filtered_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setFilters({
      year: 'All',
      month: 'All',
      gender: 'All',
      ageGroup: 'All',
      zone: 'All',
      facility: 'All',
      search: '',
    });
  };

  if (isLoading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite' }} />
        <h2 style={{ marginTop: '1.5rem', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>Loading Dog Bite Incident Dataset...</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Fetching 18,200+ registry records from Google Sheets...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div className="glass-card" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ color: '#f43f5e' }}>Unable to load dataset</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error}</p>
          <button className="btn-primary" onClick={loadData} style={{ margin: '0 auto' }}>Retry Loading</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header
        source={dataMeta.source}
        onRefresh={loadData}
        onExport={handleExportCSV}
        totalRecords={dataMeta.totalCount}
        filteredCount={filteredData.length}
        isLoading={isLoading}
      />

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        years={filterOptions.years}
        months={filterOptions.months}
        genders={filterOptions.genders}
        ageGroups={filterOptions.ageGroups}
        zones={filterOptions.zones}
        facilities={filterOptions.facilities}
        onReset={handleResetFilters}
      />

      <Scorecards stats={stats} totalDatasetCount={dataMeta.totalCount} />

      <div className="charts-grid">
        <TrendsChart monthlyTrends={stats.monthlyTrends} />
        <DemographicsChart genderData={stats.genderCounts} ageGroupData={stats.ageGroupCounts} />
        <FacilitiesChart topFacilities={stats.topFacilities} totalCount={stats.filteredCount} />
        <ZonesWardsView topZones={stats.topZones} topWards={stats.topWards} totalCount={stats.filteredCount} />
      </div>

      <PatientTable data={filteredData} />
    </div>
  );
}
