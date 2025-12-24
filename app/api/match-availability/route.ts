import { NextRequest, NextResponse } from 'next/server';
import { db, admin } from '@/app/lib/firebase-admin';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullName, phone, availability, preferredRole, comments } = body;

    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Email and full name are required' },
        { status: 400 }
      );
    }

    // Check if user is registered as a member
    const membersRef = db.collection('members');
    const memberSnapshot = await membersRef.where('email', '==', email).get();

    if (memberSnapshot.empty) {
      return NextResponse.json(
        { error: 'User is not registered. Please register as a member first.' },
        { status: 403 }
      );
    }

    // Save match availability
    const availabilityRef = db.collection('match_availability');
    await availabilityRef.add({
      email,
      fullName,
      phone,
      matchDate: '10 Jan 2026', // Current upcoming match
      availability, // 'available' or 'unavailable'
      preferredRole, // 'batsman', 'bowler', 'all-rounder', 'wicketkeeper'
      comments,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending', // pending, selected, rejected
    });

    return NextResponse.json(
      { success: true, message: 'Availability submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Match availability error:', error);
    return NextResponse.json(
      { error: 'Failed to submit availability' },
      { status: 500 }
    );
  }
}
