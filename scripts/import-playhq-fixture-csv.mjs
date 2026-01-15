import fs from 'node:fs';
import path from 'node:path';
import * as Papa from 'papaparse';

function usage() {
  console.log('Usage: node scripts/import-playhq-fixture-csv.mjs --file /absolute/path/to/advanced_fixture.csv');
}

function parseArgs(argv) {
  const args = { file: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--file' && argv[i + 1]) {
      args.file = argv[i + 1];
      i++;
    }
  }
  return args;
}

function parseDdMmYyyy(dateStr) {
  const m = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/.exec(dateStr);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return null;
  return { year, month, day };
}

function formatLongDate(year, month, day) {
  const d = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

function formatTimeToAmPm(timeStr) {
  const m = /^\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*$/.exec(timeStr);
  if (!m) return 'TBC';
  const hours = Number(m[1]);
  const minutes = Number(m[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 'TBC';
  const d = new Date(Date.UTC(2000, 0, 1, hours, minutes, 0));
  return new Intl.DateTimeFormat('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(d);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function buildLocalStartDateTime(year, month, day, timeStr) {
  const m = /^\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*$/.exec(timeStr);
  if (!m) return null;
  const hours = Number(m[1]);
  const minutes = Number(m[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return `${year}-${pad2(month)}-${pad2(day)}T${pad2(hours)}:${pad2(minutes)}:00`;
}

const { file } = parseArgs(process.argv);
if (!file) {
  usage();
  process.exit(1);
}

if (!path.isAbsolute(file)) {
  console.error('Please provide an absolute path to --file');
  process.exit(1);
}

if (!fs.existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

const csvText = fs.readFileSync(file, 'utf8');

const parsed = Papa.parse(csvText, {
  header: true,
  skipEmptyLines: true,
  transformHeader: (h) => h.trim(),
});

if (parsed.errors?.length) {
  console.error('CSV parse errors:', parsed.errors.slice(0, 5));
  process.exit(1);
}

const rows = parsed.data || [];

const matches = rows
  .map((row, idx) => {
    const gameStatus = String(row['Game Status'] || '').trim();
    const dateRaw = String(row['Game Date'] || '').trim();
    const timeRaw = String(row['Time'] || '').trim();
    const venue = String(row['Venue'] || '').trim();
    const playingSurface = String(row['Playing Surface'] || '').trim();
    const homeTeam = String(row['Home Team'] || '').trim();
    const awayTeam = String(row['Away Team'] || '').trim();
    const competition = String(row['Competition'] || '').trim();
    const grade = String(row['Grade'] || '').trim();
    const gameCode = String(row['Game Code'] || '').trim();
    const gameId = String(row['Game ID'] || '').trim();

    const dmy = parseDdMmYyyy(dateRaw);
    if (!dmy) return null;

    const dateDisplay = formatLongDate(dmy.year, dmy.month, dmy.day);
    const timeDisplay = timeRaw ? formatTimeToAmPm(timeRaw) : 'TBC';
    const startDateTime = timeRaw ? buildLocalStartDateTime(dmy.year, dmy.month, dmy.day, timeRaw) : null;

    const normalizedStatus = (() => {
      const s = gameStatus.toLowerCase();
      if (s === 'upcoming') return 'UPCOMING';
      if (s === 'live') return 'LIVE';
      return 'COMPLETED';
    })();

    const matchName = homeTeam && awayTeam ? `${homeTeam} vs ${awayTeam}` : String(row['Game Alias'] || `Match ${idx + 1}`);
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
      team1: { name: homeTeam || 'Team A', score: 0, wickets: 0, overs: '0.0', batting: [] },
      team2: { name: awayTeam || 'Team B', score: 0, wickets: 0, overs: '0.0', batting: [] },
    };
  })
  .filter(Boolean);

const outPath = path.join(process.cwd(), 'public', 'matches-data.json');
const dataToSave = {
  matches,
  lastUpdated: new Date().toISOString(),
  source: 'CSV Import (local script)',
  totalMatches: matches.length,
};

fs.writeFileSync(outPath, JSON.stringify(dataToSave, null, 2));
console.log(`✅ Wrote ${matches.length} matches to ${outPath}`);
