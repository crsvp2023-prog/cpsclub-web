import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { matchId, matchDetails, userEmail, userName } = await request.json();

    // Validate required fields
    if (!matchId || !matchDetails || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields: matchId, matchDetails, userEmail, userName' },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not initialized' },
        { status: 503 }
      );
    }

    // Create registration document
    const registrationData = {
      matchId,
      matchDetails,
      userEmail,
      userName,
      registeredAt: new Date(),
      status: 'registered'
    };

    // Add to registrations collection
    const docRef = await db.collection('matchRegistrations').add(registrationData);

    console.log('Match registration saved:', docRef.id);

    return NextResponse.json({
      success: true,
      registrationId: docRef.id,
      message: 'Successfully registered for match'
    });

  } catch (error) {
    console.error('Error registering for match:', error);
    return NextResponse.json(
      { error: 'Failed to register for match' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail parameter is required' },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not initialized' },
        { status: 503 }
      );
    }

    // Get user's registrations
    const registrationsRef = db.collection('matchRegistrations');
    const snapshot = await registrationsRef
      .where('userEmail', '==', userEmail)
      .orderBy('registeredAt', 'desc')
      .get();

    const registrations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      registeredAt: doc.data().registeredAt.toDate().toISOString()
    }));

    return NextResponse.json({
      success: true,
      registrations
    });

  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}