import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching sports news...');

    const data = {
      news: [],
      lastUpdated: new Date().toISOString(),
      sources: [],
      count: 0,
      message: 'Sports news collection disabled'
    };

    // Save to cache file
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const newsFile = path.join(publicDir, 'sports-news-data.json');
      
      fs.writeFileSync(newsFile, JSON.stringify(data, null, 2));
      console.log('Sports news cache cleared');
    } catch (fileError) {
      console.log('Cache update failed:', fileError);
    }

    return NextResponse.json({
      success: true,
      count: 0,
      sources: [],
      news: [],
      message: 'Sports news collection disabled'
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sports news',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
