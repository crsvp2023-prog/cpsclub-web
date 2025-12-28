import { NextRequest, NextResponse } from 'next/server';

let db: any = null;
let admin: any = null;
let dbReady = false;

try {
  const firebaseAdmin = require('@/app/lib/firebase-admin');
  db = firebaseAdmin.db;
  admin = firebaseAdmin.admin;
  dbReady = true;
} catch (error) {
  console.warn('Firebase Admin not initialized:', error instanceof Error ? error.message : 'Unknown error');
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Skip analytics if Firebase is not properly initialized
    if (!dbReady || !db || !admin) {
      console.warn('Analytics skipped - Firebase not initialized');
      return NextResponse.json({ success: false, skipped: true }, { status: 200 });
    }

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
