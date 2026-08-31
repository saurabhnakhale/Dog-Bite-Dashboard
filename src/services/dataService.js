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
  if (age <= 5) return '0-5 (Toddler)';
  if (age <= 12) return '6-12 (Child)';
  if (age <= 18) return '13-18 (Teen)';
  if (age <= 35) return '19-35 (Young Adult)';
  if (age <= 60) return '36-60 (Adult)';
  return '60+ (Senior)';
}

export function getSeason(month) {
  if (!month) return 'Unknown';
  const m = month.trim();
  if (['March', 'April', 'May', 'June'].includes(m)) return 'Summer (Mar-Jun)';
  if (['July', 'August', 'September', 'October'].includes(m)) return 'Monsoon (Jul-Oct)';
  if (['November', 'December', 'January', 'February'].includes(m)) return 'Winter (Nov-Feb)';
  return 'Unknown';
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
          return {
            id: index + 1,
            year: (row['Year'] || 'Unknown').trim(),
            month,
            season: getSeason(month),
            patientName: (row['Patient Name'] || 'Unknown').trim(),
            contact: (row['Contact Number'] || '').trim(),
            gender: (row['Gender'] || 'Unknown').trim(),
            ageStr: (row['Age'] || '').trim(),
            ageNum,
            ageGroup: getAgeGroup(ageNum),
            address: (row['Patient Address'] || '').trim(),
            area: (row['Area'] || '').trim(),
            dateOfOnset: (row['Date Of Onset'] || '').trim(),
            facilityName: (row['Facility Name'] || 'Unspecified Facility').trim(),
            zoneName: (row['Zone Name'] || 'Unspecified Zone').trim(),
            wardNo: (row['Ward No.'] || 'Unspecified Ward').trim(),
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
