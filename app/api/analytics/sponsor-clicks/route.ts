import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase-admin';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('analytics')
      .where('eventType', '==', 'sponsor_click')
      .get();

    return NextResponse.json({ count: snapshot.size }, { status: 200 });
  } catch (error) {
    console.error('Error getting sponsor clicks:', error);
    return NextResponse.json(
      { error: 'Failed to get sponsor clicks' },
      { status: 500 }
    );
  }
}
