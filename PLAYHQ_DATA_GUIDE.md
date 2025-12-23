# PlayHQ Data Integration Guide

## How It Works

The Scores page now pulls standings data from PlayHQ using web scraping. The system includes:

1. **Data Storage**: `data/playhq-data.json` - Stores the latest standings
2. **API Route**: `app/api/scrape-playhq/route.ts` - Fetches and scrapes PlayHQ data
3. **Frontend**: `app/scores/page.tsx` - Displays standings with refresh button

## Features

### On the Scores Page:
- **Live Standings Table** - Shows all teams, matches played, wins/losses, points, and NRR
- **Refresh Button** - Click "🔄 Refresh from PlayHQ" to manually update data
- **Last Updated** - Displays timestamp of last data refresh
- **CPS Club Highlighting** - Your team is highlighted in the standings table

## How to Use

### Manual Refresh (On the Website)
1. Go to the Scores page
2. Click the "🔄 Refresh from PlayHQ" button
3. Wait for the data to update
4. Standings table will show the latest data

### Manual Refresh (Via Script)
```bash
# Make sure your Next.js dev server is running (npm run dev)
node scripts/refresh-playhq.js
```

## Automated Updates (Optional Setup)

To automatically refresh data at regular intervals, you can use cron jobs or GitHub Actions. Here are a few options:

### Option A: Node-cron (Recommended)
```bash
npm install node-cron
```

Create `scripts/auto-refresh.js`:
```javascript
const cron = require('node-cron');

// Refresh every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Auto-refreshing PlayHQ data...');
  await fetch('http://localhost:3000/api/scrape-playhq');
});
```

### Option B: GitHub Actions
Create `.github/workflows/refresh-playhq.yml`:
```yaml
name: Refresh PlayHQ Data

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: node scripts/refresh-playhq.js
      - uses: actions/upload-artifact@v3
        with:
          name: playhq-data
          path: data/playhq-data.json
```

## Data Format

The `data/playhq-data.json` file contains:

```json
{
  "standings": [
    {
      "position": 1,
      "team": "CPS Club",
      "played": 8,
      "wins": 7,
      "losses": 1,
      "points": 14,
      "nrr": "+0.85"
    }
    // ... more teams
  ],
  "lastUpdated": "2025-12-23T12:30:00Z",
  "source": "PlayHQ Web Scrape"
}
```

## Troubleshooting

**"Failed to fetch PlayHQ data" error:**
- PlayHQ may have changed their HTML structure
- Check browser console for detailed error message
- Verify the URL is accessible: https://www.playhq.com/cricket-australia/org/chatswood-premier-sports-club/829b8e20/northern-cricket-union-summer-202526

**Data not updating:**
- Ensure your Next.js dev server is running: `npm run dev`
- Check that `data/` directory exists and is writable
- Verify file permissions on `data/playhq-data.json`

**"Could not reach PlayHQ" warning:**
- This means the scraper couldn't extract the expected data format from PlayHQ
- Falls back to default standings
- May need to update the parser if PlayHQ changed their page structure

## Manual Data Updates

If scraping fails, you can manually edit `data/playhq-data.json`:

```json
{
  "standings": [
    { "position": 1, "team": "CPS Club", "played": 9, "wins": 8, "losses": 1, "points": 16, "nrr": "+0.92" },
    { "position": 2, "team": "Eastern Suburbs", "played": 9, "wins": 6, "losses": 3, "points": 12, "nrr": "+0.55" }
    // ... update other teams
  ],
  "lastUpdated": "2025-12-24T15:45:00Z",
  "source": "PlayHQ Web Scrape"
}
```

Then refresh the page in your browser to see the changes.
