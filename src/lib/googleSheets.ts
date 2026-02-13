// Google Sheet ID for Hamieverse data
const SHEET_ID = '1djbRNl6LB-g9k-IDmn4FEaPJHEKcg1FyVu0FQ9NsG10';

export interface LoreLink {
  type: 'novel' | 'comic' | 'other';
  title: string;
  url: string;
  description?: string;
}

// Fetch data from a specific sheet tab as CSV
async function fetchSheetAsCSV(sheetName: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 minutes
    const text = await res.text();

    // Parse CSV
    const rows: string[][] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;

      // Simple CSV parsing (handles quoted fields)
      const row: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          row.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      row.push(current.trim());
      rows.push(row);
    }

    return rows;
  } catch (err) {
    console.error(`Failed to fetch sheet "${sheetName}":`, err);
    return [];
  }
}

// Fetch lore links from the "lore_links" sheet
export async function getLoreLinks(): Promise<LoreLink[]> {
  const rows = await fetchSheetAsCSV('lore_links');

  if (rows.length < 2) return []; // No data or only header

  // Skip header row, parse data
  const links: LoreLink[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0] || !row[1] || !row[2]) continue; // Skip empty rows

    links.push({
      type: (row[0].toLowerCase() as 'novel' | 'comic' | 'other') || 'other',
      title: row[1],
      url: row[2],
      description: row[3] || undefined,
    });
  }

  return links;
}
