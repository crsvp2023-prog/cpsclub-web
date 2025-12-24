import { NextRequest, NextResponse } from 'next/server';
import { db, admin } from '@/app/lib/firebase-admin';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, eventType, eventName, userAgent, page } = body;

    // Log analytics event
    await db.collection('analytics').add({
      userId: userId || 'anonymous',
      eventType,
      eventName,
      userAgent: userAgent || null,
      page: page || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error logging analytics:', error);
    return NextResponse.json(
      { error: 'Failed to log analytics' },
      { status: 500 }
    );
  }
}
