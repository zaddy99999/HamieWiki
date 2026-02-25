import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'characters!A1:Z100',
    });

    const [headers, ...rows] = res.data.values || [];
    const nameIdx = headers.indexOf('Name');
    const shownIdx = headers.indexOf('Shown');
    const pfpIdx = headers.indexOf('PFP Art');
    const factionIdx = headers.indexOf('Faction');

    const shownNames: string[] = [];
    const pfpMap: Record<string, string> = {};
    const factionMap: Record<string, string> = {};

    rows.forEach(row => {
      const name = row[nameIdx];
      if (!name) return;
      if (row[shownIdx] === 'TRUE') shownNames.push(name);
      if (pfpIdx >= 0 && row[pfpIdx]) pfpMap[name] = row[pfpIdx];
      if (factionIdx >= 0 && row[factionIdx]) factionMap[name] = row[factionIdx];
    });

    return NextResponse.json({ shownNames, pfpMap, factionMap });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
