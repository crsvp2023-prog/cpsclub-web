import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase-admin';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const snapshot = await db.collection('analytics').get();
    const uniqueUsers = new Set(
      snapshot.docs.map((doc) => doc.data().userId)
    );

    return NextResponse.json({ count: uniqueUsers.size }, { status: 200 });
  } catch (error) {
    console.error('Error getting unique users:', error);
    return NextResponse.json(
      { error: 'Failed to get unique users' },
      { status: 500 }
    );
  }
}
