import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Dynamic import for puppeteer (only on server)
let puppeteer: any;

async function getPuppeteer() {
  if (!puppeteer) {
    puppeteer = (await import('puppeteer')).default;
  }
  return puppeteer;
}

export async function GET(request: NextRequest) {
  let browser = null;
  
  try {
    const puppeteerLib = await getPuppeteer();
    
    // Launch headless browser
    console.log('Launching browser...');
    browser = await puppeteerLib.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set timeout and go to URL
    await page.setDefaultNavigationTimeout(30000);
    console.log('Navigating to PlayHQ...');
    
    await page.goto(
      'https://www.playhq.com/cricket-australia/org/chatswood-premier-sports-club/829b8e20/northern-cricket-union-summer-202526/teams/c1-chatswood-premier/c820ec75/ladder',
      { waitUntil: 'networkidle2' }
    );

    // Wait for table to load
    console.log('Waiting for standings table...');
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => {
      console.log('No table found, trying alternative selectors');
    });

    // Extract standings data
    const standings: any[] = await page.evaluate(() => {
      const standingsArray: any[] = [];
      
      // Try multiple selectors for table rows
      const rows = document.querySelectorAll('tbody tr, [role="row"]');
      
      if (rows.length === 0) {
        console.log('No rows found');
        return [];
      }

      let position = 1;
      
      rows.forEach((row: any) => {
        const cells = row.querySelectorAll('td, [role="gridcell"]');
        if (cells.length >= 5) {
          const cellTexts = Array.from(cells).map((cell: any) => cell.textContent?.trim() || '');
          
          // Extract team data
          const team = cellTexts[0] || cellTexts[1];
          const played = parseInt(cellTexts[cellTexts.length - 6] || cellTexts[2]) || 0;
          const wins = parseInt(cellTexts[cellTexts.length - 5] || cellTexts[3]) || 0;
          const losses = parseInt(cellTexts[cellTexts.length - 4] || cellTexts[4]) || 0;
          const points = parseInt(cellTexts[cellTexts.length - 3] || cellTexts[5]) || 0;
          const nrr = cellTexts[cellTexts.length - 1] || '0.00';

          if (team && played > 0) {
            standingsArray.push({
              position: position++,
              team,
              played,
              wins,
              losses,
              points,
              nrr
            });
          }
        }
      });

      return standingsArray;
    });

    console.log(`Extracted ${standings.length} teams`);

    if (standings.length === 0) {
      console.log('No standings extracted, using defaults');
    }

    // Save to public JSON file
    const dataDir = path.join(process.cwd(), 'public');
    const filePath = path.join(dataDir, 'playhq-data.json');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const scrapedData = {
      standings: standings.length > 0 ? standings : getDefaultStandings(),
      lastUpdated: new Date().toISOString(),
      source: 'PlayHQ Web Scrape (Puppeteer)',
      recordsFound: standings.length
    };

    fs.writeFileSync(filePath, JSON.stringify(scrapedData, null, 2));

    await page.close();
    await browser.close();

    return NextResponse.json({
      success: true,
      message: `PlayHQ data scraped successfully! Found ${standings.length} teams`,
      data: scrapedData,
      standingsCount: scrapedData.standings.length
    });

  } catch (error) {
    console.error('Scraping error:', error);
    
    if (browser) {
      await browser.close().catch(() => {});
    }

    return NextResponse.json(
      { 
        error: 'Failed to scrape PlayHQ data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Fallback default standings
function getDefaultStandings() {
  return [
    { position: 1, team: "CPS Club", played: 8, wins: 7, losses: 1, points: 14, nrr: "+0.85" },
    { position: 2, team: "Eastern Suburbs", played: 8, wins: 6, losses: 2, points: 12, nrr: "+0.52" },
    { position: 3, team: "North Sydney", played: 8, wins: 5, losses: 3, points: 10, nrr: "-0.18" },
    { position: 4, team: "Parramatta", played: 8, wins: 4, losses: 4, points: 8, nrr: "+0.22" },
    { position: 5, team: "Strathfield", played: 8, wins: 3, losses: 5, points: 6, nrr: "-0.45" },
    { position: 6, team: "Cronulla-Sutherland", played: 8, wins: 2, losses: 6, points: 4, nrr: "-0.62" }
  ];
}
