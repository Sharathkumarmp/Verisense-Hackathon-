import { Claim, VerificationStatus } from '../types';

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1jvPycvCS5CFAcKD5bQplhrrgfYsp3ry7Sc2_ZmDVZHcGUa9Kv-9mq9TcgiI-f434FqvDI88XD_v/pub?output=csv";

// Helper to parse CSV line handling quotes
const parseCSVLine = (str: string): string[] => {
  const result: string[] = [];
  let cell = '';
  let quote = false;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"' && str[i + 1] === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      quote = !quote;
    } else if (char === ',' && !quote) {
      result.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }
  result.push(cell);
  return result;
};

export const fetchClaimsFromSheet = async (): Promise<Claim[]> => {
  try {
    const response = await fetch(SHEET_CSV_URL);
    const text = await response.text();
    const lines = text.split(/\r?\n/);
    
    if (lines.length < 2) return [];

    // Parse headers and strip whitespace
    const headers = parseCSVLine(lines[0]).map(h => h.trim());
    
    // Map column names to indices
    const idx = {
      claim: headers.findIndex(h => h === 'Claim'),
      status: headers.findIndex(h => h === 'Status'),
      truth: headers.findIndex(h => h === 'Truth (English)'),
      debunk: headers.findIndex(h => h === 'Debunk (Native)'),
      source: headers.findIndex(h => h === 'Source'),
      city: headers.findIndex(h => h === 'City'),
      date: headers.findIndex(h => h === 'Date')
    };

    return lines.slice(1).map((line, i) => {
      if (!line.trim()) return null;
      
      const row = parseCSVLine(line);
      
      // Helper to safely get value or N/A
      const getVal = (index: number) => {
        if (index === -1) return "N/A";
        const val = row[index];
        return val ? val.trim() : "N/A";
      };

      // Map Status to Enum
      let status = VerificationStatus.Pending;
      const statusStr = getVal(idx.status).toLowerCase();
      if (statusStr.includes('verified') || statusStr.includes('true')) status = VerificationStatus.Verified;
      else if (statusStr.includes('false') || statusStr.includes('fake')) status = VerificationStatus.False;
      else if (statusStr.includes('misleading')) status = VerificationStatus.Misleading;

      // Parse Date Robustly
      let timestamp = Date.now();
      const dateStr = getVal(idx.date);
      if (dateStr !== "N/A" && dateStr.trim() !== "") {
          // Try standard parse first (ISO or MM/DD/YYYY)
          let parsed = Date.parse(dateStr);
          
          // If NaN, try parsing DD/MM/YYYY manually (common in India/UK/Sheets)
          if (isNaN(parsed) && dateStr.includes('/')) {
             const parts = dateStr.split('/');
             if (parts.length === 3) {
                 // Assume DD/MM/YYYY
                 const d = parseInt(parts[0], 10);
                 // Month is 0-indexed in JS Date constructor (0 = Jan)
                 const m = parseInt(parts[1], 10) - 1; 
                 // Handle 2-digit years if necessary, though sheets usually export 4 digits
                 let y = parseInt(parts[2], 10);
                 if (y < 100) y += 2000; 

                 const dateObj = new Date(y, m, d);
                 if (!isNaN(dateObj.getTime())) {
                     parsed = dateObj.getTime();
                 }
             }
          }
          // If it's a simple year-less format or other variations, it might fail, keeping Date.now()
          // But specific fallback logic helps with DD/MM/YYYY which Date.parse() often misinterprets as MM/DD/YYYY or fails.
          
          if (!isNaN(parsed)) timestamp = parsed;
      }

      const claim: Claim = {
        id: `csv-${i}-${Date.now()}`,
        text: getVal(idx.claim),
        status: status,
        city: getVal(idx.city),
        area: 'Community Report',
        source: getVal(idx.source),
        timestamp: timestamp,
        truthEnglish: getVal(idx.truth),
        debunkNative: getVal(idx.debunk),
        // Fallback explanation for Dashboard compatibility
        explanation: `${getVal(idx.truth)}\n\n${getVal(idx.debunk)}`
      };

      return claim;
    }).filter((c): c is Claim => c !== null);
    
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return [];
  }
};