import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as Papa from 'papaparse';
import { db } from '@/app/lib/firebase-admin';

export const runtime = 'nodejs';

const MATCHES_DOC = db.collection('siteData').doc('matches');

type CsvRow = Record<string, string | undefined>;

function parseDdMmYyyy(dateStr: string): { year: number; month: number; day: number } | null {
  // Example: 17/01/2026
  const m = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/.exec(dateStr);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return null;
  return { year, month, day };
}

function formatLongDate(year: number, month: number, day: number): string {
  // Use a stable human-friendly format similar to existing JSON: "January 18, 2026"
  const d = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(d);
}

function formatTimeToAmPm(timeStr: string): string {
  // Input: "13:00" or "13:00:00"
  const m = /^\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*$/.exec(timeStr);
  if (!m) return 'TBC';
  const hours = Number(m[1]);
  const minutes = Number(m[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 'TBC';
  const d = new Date(Date.UTC(2000, 0, 1, hours, minutes, 0));
  return new Intl.DateTimeFormat('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }).format(d);
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function buildLocalStartDateTime(year: number, month: number, day: number, timeStr: string): string | null {
  const m = /^\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*$/.exec(timeStr);
  if (!m) return null;
  const hours = Number(m[1]);
  const minutes = Number(m[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  // IMPORTANT: no timezone suffix => parsed as local time in the browser.
  return `${year}-${pad2(month)}-${pad2(day)}T${pad2(hours)}:${pad2(minutes)}:00`;
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Expected multipart/form-data with a file field named "file".' },
        { status: 400 }
      );
    }

    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Missing CSV file. Provide a form-data field named "file".' },
        { status: 400 }
      );
    }

    const csvText = await file.text();

    const parsed = Papa.parse<CsvRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
    });

    if (parsed.errors?.length) {
      return NextResponse.json(
        { error: 'Failed to parse CSV', details: parsed.errors.slice(0, 5) },
        { status: 400 }
      );
    }

    const rows: CsvRow[] = parsed.data ?? [];

    const matches = rows
      .map((row: CsvRow, idx: number) => {
        const gameStatus = (row['Game Status'] || '').trim();
        const dateRaw = (row['Game Date'] || '').trim();
        const timeRaw = (row['Time'] || '').trim();
        const venue = (row['Venue'] || '').trim();
        const playingSurface = (row['Playing Surface'] || '').trim();
        const homeTeam = (row['Home Team'] || '').trim();
        const awayTeam = (row['Away Team'] || '').trim();
        const competition = (row['Competition'] || '').trim();
        const grade = (row['Grade'] || '').trim();
        const gameCode = (row['Game Code'] || '').trim();
        const gameId = (row['Game ID'] || '').trim();

        const dmy = parseDdMmYyyy(dateRaw);
        if (!dmy) return null;

        const dateDisplay = formatLongDate(dmy.year, dmy.month, dmy.day);
        const timeDisplay = timeRaw ? formatTimeToAmPm(timeRaw) : 'TBC';
        const startDateTime = timeRaw ? buildLocalStartDateTime(dmy.year, dmy.month, dmy.day, timeRaw) : null;

        const normalizedStatus = (() => {
          const s = gameStatus.toLowerCase();
          if (s === 'upcoming') return 'UPCOMING';
          if (s === 'live') return 'LIVE';
          // everything else treat as completed-ish
          return 'COMPLETED';
        })();

        const matchName = homeTeam && awayTeam ? `${homeTeam} vs ${awayTeam}` : row['Game Alias'] || `Match ${idx + 1}`;
        const category = grade || competition || 'Northern Cricket Union';
        const venueDisplay = [venue, playingSurface].filter(Boolean).join(' / ') || 'TBC';

        return {
          id: idx + 1,
          gameCode: gameCode || undefined,
          gameId: gameId || undefined,
          matchName,
          category,
          date: dateDisplay,
          time: timeDisplay,
          startDateTime: startDateTime || undefined,
          venue: venueDisplay,
          status: normalizedStatus,
          result: '',
          team1: {
            name: homeTeam || 'Team A',
            score: 0,
            wickets: 0,
            overs: '0.0',
            batting: [],
          },
          team2: {
            name: awayTeam || 'Team B',
            score: 0,
            wickets: 0,
            overs: '0.0',
            batting: [],
          },
        };
      })
      .filter(Boolean);

    const dataToSave = {
      matches,
      lastUpdated: new Date().toISOString(),
      source: 'CSV Import (PlayHQ fixture export)',
      totalMatches: matches.length,
    };

    let wroteToFirestore = false;
    let wroteToFile = false;
    let fileWriteError: string | undefined;
    let firestoreWriteError: string | undefined;

    try {
      await MATCHES_DOC.set(dataToSave, { merge: false });
      wroteToFirestore = true;
      console.log(`✅ Imported ${matches.length} matches to Firestore (siteData/matches)`);
    } catch (e) {
      firestoreWriteError = e instanceof Error ? e.message : 'Unknown Firestore error';
      console.error('Failed to write imported matches to Firestore:', e);
    }

    // Best-effort file write for local dev
    try {
      const dataDir = path.join(process.cwd(), 'public');
      const filePath = path.join(dataDir, 'matches-data.json');

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));
      wroteToFile = true;
    } catch (e) {
      fileWriteError = e instanceof Error ? e.message : 'Unknown file write error';
      console.error('Failed to write imported matches to file:', e);
    }

    if (!wroteToFirestore && !wroteToFile) {
      return NextResponse.json(
        {
          error: 'Failed to import matches from CSV',
          details: {
            firestore: firestoreWriteError,
            file: fileWriteError,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Imported ${matches.length} matches from CSV`,
      data: dataToSave,
      persisted: {
        firestore: wroteToFirestore,
        file: wroteToFile,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to import matches from CSV',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
