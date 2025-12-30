# PlayHQ Data Integration Guide

## Overview
This guide explains how to manage and update the C One Day Grade standings from PlayHQ on your website.

## Current Data Source
The standings are fetched from PlayHQ and displayed on the Scores page at `/scores`. The data is stored in `/public/playhq-data.json`.

## How to Update Standings

### Option 1: Automatic Scraping (via Refresh Button)
1. Go to `/scores` page
2. Click the **"🔄 Refresh from PlayHQ"** button
3. The system will attempt to automatically scrape the latest data from PlayHQ
4. If successful, the standings will be updated with live data

**Note:** Automatic scraping may not always work reliably due to PlayHQ's website structure or CloudFront blocking.

### Option 2: Manual Update via API Endpoint
If automatic scraping fails, you can manually update the standings using the `/api/update-standings` endpoint.

#### Using cURL:
```bash
curl -X POST http://localhost:3000/api/update-standings \
  -H "Content-Type: application/json" \
  -d '{
    "grade": "C One Day Grade",
    "standings": [
      {
        "position": 1,
        "team": "CPS Club",
        "played": 8,
        "wins": 7,
        "losses": 1,
        "points": 14,
        "nrr": "+0.85"
      },
      {
        "position": 2,
        "team": "Eastern Suburbs",
        "played": 8,
        "wins": 6,
        "losses": 2,
        "points": 12,
        "nrr": "+0.52"
      }
    ],
    "source": "PlayHQ Manual"
  }'
```

#### Using Node.js:
```javascript
const standings = [
  {
    position: 1,
    team: "CPS Club",
    played: 8,
    wins: 7,
    losses: 1,
    points: 14,
    nrr: "+0.85"
  },
  // ... more teams
];

const response = await fetch('/api/update-standings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grade: 'C One Day Grade',
    standings: standings,
    source: 'PlayHQ Manual'
  })
});

const data = await response.json();
console.log(data);
```

#### Using Python:
```python
import requests
import json

data = {
    "grade": "C One Day Grade",
    "standings": [
        {
            "position": 1,
            "team": "CPS Club",
            "played": 8,
            "wins": 7,
            "losses": 1,
            "points": 14,
            "nrr": "+0.85"
        },
        # ... more teams
    ],
    "source": "PlayHQ Manual"
}

response = requests.post(
    'http://localhost:3000/api/update-standings',
    json=data,
    headers={'Content-Type': 'application/json'}
)

print(response.json())
```

## Data Format

### Required Fields:
- **grade** (string): The cricket grade (e.g., "C One Day Grade")
- **standings** (array): Array of team objects

### Standings Object Format:
```json
{
  "position": 1,
  "team": "Team Name",
  "played": 8,
  "wins": 7,
  "losses": 1,
  "points": 14,
  "nrr": "+0.85"
}
```

### Optional Fields:
- **source** (string): Where the data came from (e.g., "PlayHQ Manual", "PlayHQ Scrape")

## Data File Location
- **File**: `/public/playhq-data.json`
- **Structure**:
```json
{
  "grade": "C One Day Grade",
  "standings": [...],
  "lastUpdated": "2025-12-29T11:30:00.000Z",
  "source": "PlayHQ Web Scrape (Puppeteer)",
  "recordsFound": 8
}
```

## How to Get Data from PlayHQ

1. Visit: https://ca.playhq.com/org/829b8e20-e0d3-44a5-90c7-1666ada5c1fe/seasons/7fe749e5-1e03-4a25-9f9a-cfb498fe8608/all-ladders

2. Find the "C One Day Grade" standings table

3. Extract the data in the format specified above

4. Use the `/api/update-standings` endpoint to update your website

## Troubleshooting

### Issue: Scraper returns 0 teams
- **Cause**: Puppeteer can't extract data from PlayHQ (may be due to CloudFront blocking or page rendering)
- **Solution**: Use the manual update endpoint to directly input the standings

### Issue: Manual update fails
- **Check**: Ensure your JSON is properly formatted
- **Check**: Verify all required fields are present (position, team, played, wins, losses, points, nrr)
- **Check**: Server is running on localhost:3000

### Issue: Data shows as fallback defaults
- **Means**: The scraper couldn't extract live data and is using hardcoded defaults
- **Solution**: Manually update using the API endpoint with current data from PlayHQ

## API Responses

### Success Response:
```json
{
  "success": true,
  "message": "Updated standings with 8 teams",
  "data": {
    "grade": "C One Day Grade",
    "standings": [...],
    "lastUpdated": "2025-12-29T11:30:00.000Z",
    "source": "Manual Update",
    "recordsFound": 8
  }
}
```

### Error Response:
```json
{
  "error": "Invalid request. Must include standings array.",
  "status": 400
}
```

## Production Deployment
When deploying to production:
1. Ensure `/public/playhq-data.json` is tracked in your repository
2. The `/api/update-standings` endpoint can be used in production to refresh data
3. Consider setting up a scheduled task to regularly update standings
4. Store current standings in the JSON file so fallback data is always available

## Related Files
- [Scraper Route](app/api/scrape-playhq/route.ts)
- [Update Endpoint](app/api/update-standings/route.ts)  
- [Scores Page](app/scores/page.tsx)
- [Data File](public/playhq-data.json)
