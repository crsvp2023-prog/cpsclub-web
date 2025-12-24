import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase-admin';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if member exists
    const membersRef = db.collection('members');
    const memberSnapshot = await membersRef.where('email', '==', email).get();

    return NextResponse.json(
      { isRegistered: !memberSnapshot.empty, member: memberSnapshot.docs[0]?.data() },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking member status:', error);
    return NextResponse.json(
      { error: 'Failed to check member status' },
      { status: 500 }
    );
  }
}
