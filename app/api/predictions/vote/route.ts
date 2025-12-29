import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: any;
let db: any;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export async function POST(request: Request) {
  try {
    if (!db) {
      return Response.json(
        { error: 'Firebase not initialized' },
        { status: 503 }
      );
    }

    const { predictionId, optionIndex, userId } = await request.json();

    if (!predictionId || optionIndex === undefined) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const predictionRef = doc(db, 'predictions', predictionId);
    const predictionSnap = await getDoc(predictionRef);

    if (!predictionSnap.exists()) {
      return Response.json(
        { error: 'Prediction not found' },
        { status: 404 }
      );
    }

    // Update vote count for the selected option
    const voteField = `options.${optionIndex}.votes`;
    await updateDoc(predictionRef, {
      [voteField]: increment(1),
      totalVotes: increment(1),
      lastUpdated: new Date(),
    });

    // Track user vote (optional)
    if (userId && userId !== 'anonymous') {
      const userVoteRef = doc(db, 'userVotes', `${userId}_${predictionId}`);
      try {
        await updateDoc(userVoteRef, {
          optionIndex,
          votedAt: new Date(),
        });
      } catch (error) {
        // Create new document if it doesn't exist
        await setDoc(userVoteRef, {
          userId,
          predictionId,
          optionIndex,
          votedAt: new Date(),
        });
      }
    }

    return Response.json(
      {
        success: true,
        message: 'Vote recorded successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error recording vote:', error);
    return Response.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    if (!db) {
      return Response.json(
        { error: 'Firebase not initialized' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get('predictionId');

    if (!predictionId) {
      return Response.json(
        { error: 'Missing predictionId' },
        { status: 400 }
      );
    }

    const predictionRef = doc(db, 'predictions', predictionId);
    const predictionSnap = await getDoc(predictionRef);

    if (!predictionSnap.exists()) {
      return Response.json(
        { error: 'Prediction not found' },
        { status: 404 }
      );
    }

    return Response.json(predictionSnap.data(), { status: 200 });
  } catch (error) {
    console.error('Error fetching prediction:', error);
    return Response.json(
      { error: 'Failed to fetch prediction' },
      { status: 500 }
    );
  }
}
