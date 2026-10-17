import { NextResponse } from 'next/server';

// Dynamic import for puppeteer (only on server)
let puppeteer: (typeof import('puppeteer'))['default'] | undefined;

export const dynamic = 'force-dynamic';

async function getPuppeteer() {
  if (!puppeteer) {
    puppeteer = (await import('puppeteer')).default;
  }
  return puppeteer;
}

export async function GET() {
  const competitionUrl = process.env.PLAYHQ_LADDER_URL;
  if (!competitionUrl) {
    return NextResponse.json(
      { error: 'Set PLAYHQ_LADDER_URL to the current PlayHQ competition ladder URL.' },
      { status: 503 }
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(competitionUrl);
  } catch {
    return NextResponse.json({ error: 'PLAYHQ_LADDER_URL must be a valid URL.' }, { status: 500 });
  }
  if (
    parsedUrl.protocol !== 'https:' ||
    (parsedUrl.hostname !== 'playhq.com' && !parsedUrl.hostname.endsWith('.playhq.com'))
  ) {
    return NextResponse.json({ error: 'PLAYHQ_LADDER_URL must point to a secure PlayHQ page.' }, { status: 500 });
  }

  let browser = null;
  const startTime = Date.now();
  
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
    await page.setRequestInterception(true);
    page.on('request', (req) => {
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
    await page.goto(competitionUrl, { waitUntil: 'networkidle2' });

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
    const standings = await page.evaluate(() => {
      const standingsArray: {
        position: number;
        team: string;
        played: number;
        wins: number;
        losses: number;
        points: number;
        nrr: string;
      }[] = [];
      
      // Strategy 1: Look for table-based data
      let rows: Element[] = Array.from(document.querySelectorAll('tbody tr'));
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
      
      rows.forEach((row) => {
        // Try td elements first
        let cells = Array.from(row.querySelectorAll('td'));
        if (cells.length === 0) {
          cells = Array.from(row.querySelectorAll('[role="gridcell"]'));
        }
        
        if (cells.length >= 5) {
          const cellTexts = cells.map((cell) => (cell.textContent?.trim() || '').replace(/\n/g, ' '));
          
          console.log('Row cells:', cellTexts);
          
          // Extract team data - try different patterns
          const team = cellTexts[0];
          const played = parseInt(cellTexts[1]) || 0;
          const wins = parseInt(cellTexts[2]) || 0;
          const losses = parseInt(cellTexts[3]) || 0;
          const points = parseInt(cellTexts[4]) || 0;
          const nrr = cellTexts[5] || '0.00';

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
      await page.close();
      await browser.close();
      browser = null;
      return NextResponse.json(
        {
          error: 'PlayHQ did not return standings for the configured competition.',
          duration: `${Date.now() - startTime}ms`,
        },
        { status: 502 }
      );
    }

    const responseData = {
      grade: foundGrade,
      standings,
      lastUpdated: new Date().toISOString(),
      source: 'PlayHQ live scrape',
      recordsFound: standings.length,
    };
    const elapsedTime = Date.now() - startTime;
    console.log(`Total scrape time: ${elapsedTime}ms`);

    if (browser) {
      await page.close().catch(() => {});
      await browser.close().catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: `PlayHQ data scraped successfully! Found ${standings.length} teams`,
      data: responseData,
      standingsCount: standings.length,
      duration: `${elapsedTime}ms`
    });

  } catch (error) {
    console.error('Scraping error:', error);
    const elapsedTime = Date.now() - startTime;
    
    if (browser) {
      await browser.close().catch(() => {});
    }

    return NextResponse.json(
      { 
        error: 'Failed to scrape PlayHQ data',
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'No cached or sample data is displayed when PlayHQ cannot be reached.',
        duration: `${elapsedTime}ms`
      },
      { status: 502 }
    );
  }
}
