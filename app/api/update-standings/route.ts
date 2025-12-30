import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request has standings
    if (!body.standings || !Array.isArray(body.standings)) {
      return NextResponse.json(
        { error: 'Invalid request. Must include standings array.' },
        { status: 400 }
      );
    }

    // Prepare the data
    const standingsData = {
      grade: body.grade || 'C One Day Grade',
      standings: body.standings,
      lastUpdated: new Date().toISOString(),
      source: body.source || 'Manual Update',
      recordsFound: body.standings.length
    };

    // Save to public JSON file
    const dataDir = path.join(process.cwd(), 'public');
    const filePath = path.join(dataDir, 'playhq-data.json');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(standingsData, null, 2));
    
    console.log(`Standings updated successfully with ${body.standings.length} teams`);

    return NextResponse.json({
      success: true,
      message: `Updated standings with ${body.standings.length} teams`,
      data: standingsData
    });

  } catch (error) {
    console.error('Update standings error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update standings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    info: 'POST endpoint to manually update standings from PlayHQ',
    example: {
      method: 'POST',
      url: '/api/update-standings',
      body: {
        grade: 'C One Day Grade',
        standings: [
          {
            position: 1,
            team: 'Team Name',
            played: 8,
            wins: 7,
            losses: 1,
            points: 14,
            nrr: '+0.85'
          }
        ],
        source: 'PlayHQ Manual'
      }
    }
  });
}
