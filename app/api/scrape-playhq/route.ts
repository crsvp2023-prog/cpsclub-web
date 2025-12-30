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
  const startTime = Date.now();
  const maxDuration = 25000; // 25 second timeout
  
  try {
    const puppeteerLib = await getPuppeteer();
    
    // Launch headless browser with optimizations
    console.log('Launching browser...');
    browser = await puppeteerLib.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    
    // Set smaller viewport and disable images for faster loading
    await page.setViewport({ width: 1366, height: 768 });
    
    // Block unnecessary resources
    await page.on('request', (req: any) => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    // Set timeout and go to URL
    await page.setDefaultNavigationTimeout(20000);
    console.log('Navigating to PlayHQ ladder...');
    
    // Navigate to all-ladders page to find C One Day Grade
    console.log('Navigating to PlayHQ ladder...');
    await page.goto(
      'https://www.playhq.com/cricket-australia/org/chatswood-premier-sports-club/829b8e20/northern-cricket-union-summer-202526/teams/c1-chatswood-premier/c820ec75/ladder',
      { waitUntil: 'networkidle2' }
    );

    // Wait for content to load
    console.log('Waiting for standings content...');
    await page.waitForSelector('table, [class*="ladder"], [class*="standing"], [role="grid"]', { timeout: 10000 }).catch(() => {
      console.log('No standings selector found, continuing...');
    });

    // Add extra wait for dynamic content
    await new Promise(r => setTimeout(r, 3000));

    // Get page title and basic info
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        hasTable: !!document.querySelector('table'),
        tableCount: document.querySelectorAll('table').length,
        hasRows: !!document.querySelector('[role="row"]'),
        rowCount: document.querySelectorAll('[role="row"]').length,
        pageText: document.body.innerText.substring(0, 300)
      };
    });
    
    console.log('Page Info:', JSON.stringify(pageInfo));

    // Extract standings data with improved selectors
    const standings: any[] = await page.evaluate(() => {
      const standingsArray: any[] = [];
      
      // Strategy 1: Look for table-based data
      let rows = Array.from(document.querySelectorAll('tbody tr'));
      console.log('Found tbody rows:', rows.length);
      
      // Strategy 2: If no table rows, try divs with role="row"
      if (rows.length === 0) {
        rows = Array.from(document.querySelectorAll('[role="row"]'));
        console.log('Found role=row elements:', rows.length);
      }
      
      // Strategy 3: Look for any table structure
      if (rows.length === 0) {
        const tables = document.querySelectorAll('table');
        console.log('Found tables:', tables.length);
        if (tables.length > 0) {
          rows = Array.from(tables[0].querySelectorAll('tr'));
          console.log('Found tr in first table:', rows.length);
        }
      }

      if (rows.length === 0) {
        console.log('No rows found with any strategy');
        return [];
      }

      let position = 1;
      
      rows.forEach((row: any) => {
        // Try td elements first
        let cells = Array.from(row.querySelectorAll('td'));
        if (cells.length === 0) {
          cells = Array.from(row.querySelectorAll('[role="gridcell"]'));
        }
        
        if (cells.length >= 5) {
          const cellTexts = cells.map((cell: any) => (cell.textContent?.trim() || '').replace(/\n/g, ' '));
          
          console.log('Row cells:', cellTexts);
          
          // Extract team data - try different patterns
          let team = cellTexts[0];
          let played = parseInt(cellTexts[1]) || 0;
          let wins = parseInt(cellTexts[2]) || 0;
          let losses = parseInt(cellTexts[3]) || 0;
          let points = parseInt(cellTexts[4]) || 0;
          let nrr = cellTexts[5] || '0.00';

          // Skip header rows
          if (team && team.toLowerCase() !== 'team' && team.toLowerCase() !== 'position' && played > 0) {
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

      console.log('Extracted standings:', standingsArray.length);
      return standingsArray;
    });

    const foundGrade = 'C One Day Grade';

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
      grade: foundGrade || 'C One Day Grade',
      standings: standings.length > 0 ? standings : getDefaultStandings(),
      lastUpdated: new Date().toISOString(),
      source: standings.length > 0 ? 'PlayHQ Web Scrape (Puppeteer)' : 'Default Fallback',
      recordsFound: standings.length,
      note: standings.length === 0 ? 'Could not extract live data from PlayHQ. To update manually, use /api/update-standings' : undefined
    };

    fs.writeFileSync(filePath, JSON.stringify(scrapedData, null, 2));
    
    console.log(`Scrape completed: ${standings.length} teams extracted, using ${standings.length > 0 ? 'live' : 'fallback'} data`);

    const elapsedTime = Date.now() - startTime;
    console.log(`Total scrape time: ${elapsedTime}ms`);

    if (browser) {
      await page.close().catch(() => {});
      await browser.close().catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: standings.length > 0 
        ? `PlayHQ data scraped successfully! Found ${standings.length} teams`
        : 'Could not extract live data. Using fallback standings. Try /api/update-standings for manual update.',
      data: scrapedData,
      standingsCount: scrapedData.standings.length,
      duration: `${elapsedTime}ms`
    });

  } catch (error) {
    console.error('Scraping error:', error);
    const elapsedTime = Date.now() - startTime;
    
    if (browser) {
      await browser.close().catch(() => {});
    }

    // Return existing data even if scraping fails
    try {
      const dataDir = path.join(process.cwd(), 'public');
      const filePath = path.join(dataDir, 'playhq-data.json');
      if (fs.existsSync(filePath)) {
        const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return NextResponse.json({
          success: false,
          message: 'Scraping failed, returning existing data',
          data: existingData,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: `${elapsedTime}ms`
        }, { status: 200 });
      }
    } catch (e) {
      console.error('Could not load existing data:', e);
    }

    return NextResponse.json(
      { 
        error: 'Failed to scrape PlayHQ data',
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Try using POST /api/update-standings to manually update standings',
        duration: `${elapsedTime}ms`
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
