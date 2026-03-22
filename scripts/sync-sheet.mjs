import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env - from .env.local if available, otherwise from process.env (Vercel)
const envVars = {};
const envPath = join(__dirname, '../.env.local');
try {
  const env = readFileSync(envPath, 'utf-8');
  for (const line of env.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) envVars[match[1]] = match[2].replace(/^"|"$/g, '');
  }
} catch {
  Object.assign(envVars, process.env);
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    client_email: envVars.GOOGLE_CLIENT_EMAIL?.trim(),
    private_key: envVars.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim(),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

const res = await sheets.spreadsheets.values.get({
  spreadsheetId: envVars.GOOGLE_SHEET_ID,
  range: 'characters!A1:Z200',
});

const [headers, ...rows] = res.data.values || [];
console.log('Headers:', headers);

const col = (name) => headers.indexOf(name);

const shownNames = [];
const pfpMap = {};
const factionMap = {};
const sheetCharacters = {};

for (const row of rows) {
  const name = row[col('Name')];
  if (!name) continue;

  if (row[col('Shown')] === 'TRUE') shownNames.push(name);
  if (col('PFP Art') >= 0 && row[col('PFP Art')]) pfpMap[name] = row[col('PFP Art')];
  if (col('Faction') >= 0 && row[col('Faction')]) factionMap[name] = row[col('Faction')];

  // Full character data from sheet
  const charData = { name };
  const fieldMap = {
    species: 'Species',
    role: 'Role',
    aliases: 'Aliases',
    traits: 'Traits',
    motivations: 'Motivations',
    notableInfo: 'Notable Info',
    relationships: 'Relationships',
    arc: 'Arc',
    color: 'Color',
    pfpFile: 'PFP Art',
    gifFile: 'GIF File',
    tier: 'Tier',
    faction: 'Faction',
    similarCharacters: 'Similar Characters',
  };

  for (const [key, colName] of Object.entries(fieldMap)) {
    const idx = col(colName);
    if (idx >= 0 && row[idx]) {
      // Parse comma-separated arrays for certain fields
      if (['aliases', 'traits', 'motivations', 'similarCharacters'].includes(key)) {
        charData[key] = row[idx].split(',').map(s => s.trim()).filter(Boolean);
      } else {
        charData[key] = row[idx];
      }
    }
  }

  sheetCharacters[name] = charData;
}

console.log(`\nShown (${shownNames.length}):`, shownNames);
console.log(`\nTotal characters in sheet: ${Object.keys(sheetCharacters).length}`);

// Write shownCharacters.ts
const shownOutput = `export const shownNames: string[] = ${JSON.stringify(shownNames, null, 2)};

export const pfpMap: Record<string, string> = ${JSON.stringify(pfpMap, null, 2)};

export const factionMap: Record<string, string> = ${JSON.stringify(factionMap, null, 2)};
`;

writeFileSync(join(__dirname, '../src/lib/hamieverse/shownCharacters.ts'), shownOutput);
console.log('Wrote shownCharacters.ts');

// Write sheetCharacters.ts with full character data
const sheetOutput = `// Auto-generated from Google Sheet. Run scripts/sync-sheet.mjs to update.
export const sheetCharacters: Record<string, any> = ${JSON.stringify(sheetCharacters, null, 2)};
`;

writeFileSync(join(__dirname, '../src/lib/hamieverse/sheetCharacters.ts'), sheetOutput);
console.log('Wrote sheetCharacters.ts');

// Print summary of what changed
console.log('\n=== SHEET CHARACTER DATA SUMMARY ===');
for (const [name, data] of Object.entries(sheetCharacters)) {
  const fields = Object.keys(data).filter(k => k !== 'name').join(', ');
  console.log(`  ${name}: [${fields}]`);
}
