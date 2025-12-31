import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matches, source } = body;

    if (!matches || !Array.isArray(matches)) {
      return NextResponse.json(
        { error: 'Invalid matches data. Expected an array of matches.' },
        { status: 400 }
      );
    }

    // Create the data structure
    const dataToSave = {
      matches,
      lastUpdated: new Date().toISOString(),
      source: source || 'Manual Update',
      totalMatches: matches.length
    };

    // Save to file
    const dataDir = path.join(process.cwd(), 'public');
    const filePath = path.join(dataDir, 'matches-data.json');

    // Ensure directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write the data to file
    fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));

    console.log(`✅ Saved ${matches.length} matches to file`);

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${matches.length} matches`,
      data: dataToSave
    });

  } catch (error) {
    console.error('Error updating matches:', error);
    return NextResponse.json(
      {
        error: 'Failed to update matches',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return current matches data
    const dataDir = path.join(process.cwd(), 'public');
    const filePath = path.join(dataDir, 'matches-data.json');

    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return NextResponse.json({
        success: true,
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'No matches data found'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error reading matches:', error);
    return NextResponse.json(
      {
        error: 'Failed to read matches',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}