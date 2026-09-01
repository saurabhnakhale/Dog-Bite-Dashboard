import Papa from 'papaparse';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQA80P0DY0EVUbyfyC9ll9GLJ8qtjSAhr2Vl2Vgqm9cAQUXMbCNEvrGvRcA1Wc8OBXxED1sH0F73TQT/pub?output=csv';
const LOCAL_BACKUP_CSV_URL = '/dog_bites.csv';

export function parseAge(ageStr) {
  if (!ageStr) return null;
  const match = String(ageStr).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export function getAgeGroup(age) {
  if (age === null || age === undefined || isNaN(age)) return 'Unknown';
  if (age <= 5) return '0-5';
  if (age <= 12) return '6-12';
  if (age <= 18) return '13-18';
  if (age <= 35) return '19-35';
  if (age <= 60) return '36-60';
  return '60+';
}

export function getSeason(month) {
  if (!month) return 'Unknown';
  const m = month.trim();
  if (['December', 'January', 'February'].includes(m)) return 'Winter (Dec-Feb)';
  if (['March', 'April', 'May'].includes(m)) return 'Summer (Mar-May)';
  if (['June', 'July', 'August', 'September'].includes(m)) return 'Monsoon (Jun-Sep)';
  if (['October', 'November'].includes(m)) return 'Post-Monsoon (Oct-Nov)';
  return 'Unknown';
}

export function parseWeek(dateStr) {
  if (!dateStr) return { day: null, weekOfMonth: 'Unknown', isoWeek: null };
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      let weekOfMonth = 'Week 1 (1-7)';
      if (day > 28) weekOfMonth = 'Week 5 (29-31)';
      else if (day > 21) weekOfMonth = 'Week 4 (22-28)';
      else if (day > 14) weekOfMonth = 'Week 3 (15-21)';
      else if (day > 7) weekOfMonth = 'Week 2 (8-14)';

      // Calculate approximate ISO week
      const dateObj = new Date(year, month - 1, day);
      const startOfYear = new Date(year, 0, 1);
      const pastDaysOfYear = (dateObj - startOfYear) / 86400000;
      const isoWeek = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

      return { day, weekOfMonth, isoWeek: `W${isoWeek}` };
    }
  }
  return { day: null, weekOfMonth: 'Unknown', isoWeek: null };
}

export async function fetchDogBiteData() {
  let csvText = '';
  let source = 'Live Google Sheets';

  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, { cache: 'no-cache' });
    if (response.ok) {
      csvText = await response.text();
      if (!csvText.includes('Year,Month')) {
        throw new Error('Invalid CSV structure from live endpoint');
      }
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (err) {
    console.warn('Could not fetch from live Google Sheets, loading local backup dataset...', err);
    const backupRes = await fetch(LOCAL_BACKUP_CSV_URL);
    csvText = await backupRes.text();
    source = 'Local Dataset Backup';
  }

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleanedRows = results.data.map((row, index) => {
          const ageNum = parseAge(row['Age']);
          const month = (row['Month'] || 'Unknown').trim();
          const dateOfOnset = (row['Date Of Onset'] || '').trim();
          const weekInfo = parseWeek(dateOfOnset);

          // Parse Death (NMC / Outside)
          const deathRaw = (
            row['Death (NMC/Outside)'] ||
            row['Death (NMC / Outside)'] ||
            row['Death'] ||
            ''
          ).trim();

          let deathCategory = 'None';
          const dLower = deathRaw.toLowerCase();
          if (dLower.includes('nmc')) {
            deathCategory = 'NMC';
          } else if (dLower.includes('outside')) {
            deathCategory = 'Outside';
          } else if (dLower === 'yes' || dLower === 'death') {
            deathCategory = 'NMC';
          }

          return {
            id: index + 1,
            year: (row['Year'] || 'Unknown').trim(),
            month,
            season: getSeason(month),
            weekOfMonth: weekInfo.weekOfMonth,
            isoWeek: weekInfo.isoWeek,
            patientName: (row['Patient Name'] || 'Unknown').trim(),
            contact: (row['Contact Number'] || '').trim(),
            gender: (row['Gender'] || 'Unknown').trim(),
            ageStr: (row['Age'] || '').trim(),
            ageNum,
            ageGroup: getAgeGroup(ageNum),
            address: (row['Patient Address'] || '').trim(),
            area: (row['Area'] || '').trim(),
            dateOfOnset,
            facilityName: (row['Facility Name'] || 'Unspecified Facility').trim(),
            zoneName: (row['Zone Name'] || 'Unspecified Zone').trim(),
            wardNo: (row['Ward No.'] || 'Unspecified Ward').trim(),
            deathRaw,
            deathCategory,
            isDeath: deathCategory !== 'None',
          };
        });

        resolve({
          data: cleanedRows,
          source,
          totalCount: cleanedRows.length,
        });
      },
      error: (err) => reject(err),
    });
  });
}
