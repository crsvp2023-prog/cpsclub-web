import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    
    console.log('🚀 Launching browser for match data...');
    browser = await puppeteerLib.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    console.log('📄 Navigating to PlayHQ game centre...');
    await page.goto(
      'https://www.playhq.com/cricket-australia/org/northern-suburbs-cricket-association-nsw/northern-cricket-union-summer-202526/c-one-day-grade/game-centre/990f32c1',
      { waitUntil: 'networkidle2', timeout: 30000 }
    );

    console.log('⏳ Waiting for match data to load...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract match data
    const matches = await page.evaluate(() => {
      const matchesArray: any[] = [];
      
      // Try to find match cards/rows
      const matchCards = document.querySelectorAll('[class*="match"], [class*="game"], [role="article"]');
      
      if (matchCards.length === 0) {
        console.log('No match cards found');
        return [];
      }

      matchCards.forEach((card: any) => {
        try {
          // Extract match info
          const teamElements = card.querySelectorAll('[class*="team"]');
          const scoreElements = card.querySelectorAll('[class*="score"]');
          const dateElements = card.querySelectorAll('time, [class*="date"]');
          
          if (teamElements.length >= 2) {
            const match = {
              id: Math.random(),
              matchName: `${teamElements[0]?.textContent?.trim() || 'Team A'} vs ${teamElements[1]?.textContent?.trim() || 'Team B'}`,
              date: dateElements[0]?.textContent?.trim() || 'TBD',
              status: card.textContent?.includes('Completed') ? 'COMPLETED' : 
                      card.textContent?.includes('Live') ? 'LIVE' : 'UPCOMING',
              team1: {
                name: teamElements[0]?.textContent?.trim() || 'Team A',
                score: scoreElements[0]?.textContent?.match(/\d+/)?.[0] || '0',
                wickets: scoreElements[0]?.textContent?.match(/\/(\d+)/)?.[1] || '0',
                overs: '20.0'
              },
              team2: {
                name: teamElements[1]?.textContent?.trim() || 'Team B',
                score: scoreElements[1]?.textContent?.match(/\d+/)?.[0] || '0',
                wickets: scoreElements[1]?.textContent?.match(/\/(\d+)/)?.[1] || '0',
                overs: '20.0'
              }
            };
            
            if (match.team1.name !== match.team2.name) {
              matchesArray.push(match);
            }
          }
        } catch (e) {
          console.log('Error parsing match card:', e);
        }
      });

      return matchesArray;
    });

    console.log(`Extracted ${matches.length} matches`);

    // Save to public JSON file
    const filePath = path.join(process.cwd(), 'public/matches-data.json');
    
    const matchesData = {
      matches: matches.length > 0 ? matches : getDefaultMatches(),
      lastUpdated: new Date().toISOString(),
      source: 'PlayHQ Game Centre',
      recordsFound: matches.length
    };

    fs.writeFileSync(filePath, JSON.stringify(matchesData, null, 2));

    await page.close();
    await browser.close();

    return NextResponse.json({
      success: true,
      message: `Match data scraped! Found ${matches.length} matches`,
      data: matchesData
    });

  } catch (error) {
    console.error('Scraping error:', error);
    
    if (browser) {
      await browser.close().catch(() => {});
    }

    return NextResponse.json(
      { 
        error: 'Failed to scrape match data',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Please manually provide match data from PlayHQ'
      },
      { status: 500 }
    );
  }
}

function getDefaultMatches() {
  return [
    {
      id: 1,
      matchName: "CPS Club vs Hornsby",
      category: "Northern Cricket Union - Grade C",
      date: "December 20, 2025",
      venue: "Chatswood Premier Sports Club",
      status: "COMPLETED",
      result: "CPS Club won by 32 runs",
      team1: {
        name: "CPS Club",
        score: 156,
        wickets: 7,
        overs: "20.0",
        batting: []
      },
      team2: {
        name: "Hornsby",
        score: 124,
        wickets: 8,
        overs: "20.0",
        batting: []
      }
    }
  ];
}
