import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { uid, photoURL } = await request.json();
    if (!uid || !photoURL) {
      return NextResponse.json({ error: 'Missing required fields: uid, photoURL' }, { status: 400 });
    }
    if (!db) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 503 });
    }
    const userRef = db.collection('users').doc(uid);
    await userRef.set({ photoURL }, { merge: true });
    return NextResponse.json({ success: true, message: 'Profile photo updated' });
  } catch (error) {
    console.error('Error updating profile photo:', error);
    return NextResponse.json({ error: 'Failed to update profile photo' }, { status: 500 });
  }
}
