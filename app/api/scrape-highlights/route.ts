import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const PLAYHQ_URL = 'https://ca.playhq.com/org/829b8e20-e0d3-44a5-90c7-1666ada5c1fe/games/f7fa3901-0afd-43d7-9011-eeaf0bb12abf?fromDate=2025-12-13&toDate=2025-12-13';

export async function GET(request: NextRequest) {
  try {
    console.log('Scraping PlayHQ highlights...');

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ]
      });

      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(60000);
      await page.setDefaultTimeout(60000);

      console.log(`Navigating to: ${PLAYHQ_URL}`);
      await page.goto(PLAYHQ_URL, { waitUntil: 'networkidle2' });

      // Wait for match data to load
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Extract match data
      const matches = await page.evaluate(() => {
        const matchElements = document.querySelectorAll('[class*="match"], [class*="game"], [class*="fixture"]');
        const matches: any[] = [];

        // Try to extract from visible text
        const bodyText = document.body.innerText;
        const lines = bodyText.split('\n');

        // Look for match patterns
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          // Look for team names followed by scores
          if (line.includes('vs') || line.includes('v')) {
            const nextLine = lines[i + 1]?.trim() || '';
            const match = {
              title: line,
              score: nextLine,
              date: new Date().toISOString().split('T')[0]
            };
            
            if (match.title && match.title.length > 3) {
              matches.push(match);
            }
          }
        }

        return matches;
      });

      console.log(`Found ${matches.length} matches`);

      // Format highlights data
      const highlights = matches.map((match, index) => ({
        id: `highlight-${index + 1}`,
        title: match.title || `Match ${index + 1}`,
        description: match.score || 'Match highlights',
        youtubeId: 'jZ3JNcJqifA', // Placeholder - would need actual video IDs
        category: 'highlights' as const,
        date: match.date || new Date().toISOString().split('T')[0],
        source: 'PlayHQ'
      }));

      // If no matches found, use defaults
      if (highlights.length === 0) {
        console.log('No matches found, using default highlights');
        highlights.push({
          id: 'highlight-1',
          title: 'Latest Match Highlights',
          description: 'View the latest match highlights from PlayHQ',
          youtubeId: 'jZ3JNcJqifA',
          category: 'highlights' as const,
          date: new Date().toISOString().split('T')[0],
          source: 'PlayHQ'
        });
      }

      // Save to file
      const dataDir = path.join(process.cwd(), 'public');
      const highlightsPath = path.join(dataDir, 'highlights-data.json');

      const highlightsData = {
        highlights: highlights,
        lastUpdated: new Date().toISOString(),
        source: 'PlayHQ Scraper',
        recordsFound: highlights.length,
        url: PLAYHQ_URL
      };

      fs.writeFileSync(highlightsPath, JSON.stringify(highlightsData, null, 2));

      console.log(`Successfully saved ${highlights.length} highlights`);

      return NextResponse.json({
        success: true,
        message: `Extracted ${highlights.length} highlights from PlayHQ`,
        highlightsCount: highlights.length,
        highlights: highlights
      });

    } catch (error) {
      console.error('Puppeteer error:', error);
      
      // Return default highlights on error
      const dataDir = path.join(process.cwd(), 'public');
      const highlightsPath = path.join(dataDir, 'highlights-data.json');

      const defaultHighlights = {
        highlights: [
          {
            id: 'highlight-1',
            title: 'Cricket Tournament Highlights',
            description: 'Best moments from our cricket tournaments and match-winning performances',
            youtubeId: 'jZ3JNcJqifA',
            category: 'highlights' as const,
            date: new Date().toISOString().split('T')[0],
            source: 'Default'
          }
        ],
        lastUpdated: new Date().toISOString(),
        source: 'PlayHQ (Fallback)',
        recordsFound: 1,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      fs.writeFileSync(highlightsPath, JSON.stringify(defaultHighlights, null, 2));

      return NextResponse.json({
        success: false,
        message: 'Could not scrape PlayHQ, using fallback data',
        highlights: defaultHighlights.highlights
      });
    } finally {
      if (browser) {
        await browser.close();
      }
    }

  } catch (error) {
    console.error('Highlights scraping error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to scrape highlights',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
