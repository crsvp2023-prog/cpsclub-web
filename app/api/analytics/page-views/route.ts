import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase-admin';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    let query = db.collection('analytics').where('eventType', '==', 'page_view');
    
    if (page) {
      query = query.where('page', '==', page);
    }

    const snapshot = await query.get();
    return NextResponse.json({ count: snapshot.size }, { status: 200 });
  } catch (error) {
    console.error('Error getting page views:', error);
    return NextResponse.json(
      { error: 'Failed to get page views' },
      { status: 500 }
    );
  }
}
