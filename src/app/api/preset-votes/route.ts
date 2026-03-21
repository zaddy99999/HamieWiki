import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const SHEET = 'preset-votes';

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      client_email: process.env.GOOGLE_CLIENT_EMAIL?.trim(),
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim(),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

async function getRows(sheets: any) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET}!A2:D`,
  });
  return (res.data.values || []) as string[][];
}

export async function GET() {
  try {
    const sheets = google.sheets({ version: 'v4', auth: getAuth() });
    const rows = await getRows(sheets);
    const counts: Record<string, number> = {};
    rows.forEach(([preset, , , liked]) => {
      if (liked === 'TRUE') counts[preset] = (counts[preset] ?? 0) + 1;
    });
    return NextResponse.json(counts);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { presetName, uuid, action } = await req.json();
    if (!presetName || !uuid || !action) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }

    const ip = getIP(req);
    const sheets = google.sheets({ version: 'v4', auth: getAuth() });
    const rows = await getRows(sheets);

    if (action === 'like') {
      const uuidActive = rows.findIndex(r => r[0] === presetName && r[1] === uuid && r[3] === 'TRUE');
      const ipActive   = rows.findIndex(r => r[0] === presetName && r[2] === ip   && r[3] === 'TRUE');
      if (uuidActive >= 0 || ipActive >= 0) {
        return NextResponse.json({ error: 'already voted' }, { status: 409 });
      }
      // Reuse existing row if uuid has unliked before, otherwise append
      const prev = rows.findIndex(r => r[0] === presetName && r[1] === uuid);
      if (prev >= 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: `${SHEET}!D${prev + 2}`,
          valueInputOption: 'RAW',
          requestBody: { values: [['TRUE']] },
        });
      } else {
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: `${SHEET}!A:D`,
          valueInputOption: 'RAW',
          requestBody: { values: [[presetName, uuid, ip, 'TRUE']] },
        });
      }
    } else if (action === 'unlike') {
      const rowIdx = rows.findIndex(r => r[0] === presetName && r[1] === uuid && r[3] === 'TRUE');
      if (rowIdx < 0) {
        return NextResponse.json({ error: 'not voted' }, { status: 409 });
      }
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${SHEET}!D${rowIdx + 2}`,
        valueInputOption: 'RAW',
        requestBody: { values: [['FALSE']] },
      });
    } else {
      return NextResponse.json({ error: 'invalid action' }, { status: 400 });
    }

    const updatedRows = await getRows(sheets);
    const count = updatedRows.filter(r => r[0] === presetName && r[3] === 'TRUE').length;
    return NextResponse.json({ count });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
