import { db, admin } from '@/app/lib/firebase-admin';
import { type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type StoredOption = { name?: string; votes?: number };

function normalizeOptions(raw: unknown): Array<{ name: string; votes: number }> {
  if (Array.isArray(raw)) {
    // Could be string[] or {name,votes}[]
    return raw
      .map((opt: any) => {
        if (typeof opt === 'string') {
          return { name: opt.trim(), votes: 0 };
        }
        const name = typeof opt?.name === 'string' ? opt.name.trim() : '';
        const votes = typeof opt?.votes === 'number' ? opt.votes : 0;
        return { name, votes };
      })
      .filter((o) => o.name.length > 0);
  }

  // If votes were written via dotted paths without an array, Firestore may store this as a map:
  // options: { "0": { name, votes }, "1": { name, votes } }
  if (raw && typeof raw === 'object') {
    const entries = Object.entries(raw as Record<string, any>)
      .filter(([k]) => /^\d+$/.test(k))
      .sort((a, b) => Number(a[0]) - Number(b[0]));

    return entries
      .map(([, v]) => {
        const name = typeof v?.name === 'string' ? v.name.trim() : '';
        const votes = typeof v?.votes === 'number' ? v.votes : 0;
        return { name, votes };
      })
      .filter((o) => o.name.length > 0);
  }

  return [];
}


export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      predictionId?: string;
      optionIndex?: number;
      userId?: string;
      question?: string;
      matchDate?: string;
      options?: Array<{ name?: string } | string>;
    };

    const { predictionId, optionIndex, userId, question, matchDate, options } = body;

    if (!predictionId || optionIndex === undefined) {
      return Response.json(
        { error: 'Missing required fields: predictionId and optionIndex' },
        { status: 400 }
      );
    }

    if (typeof optionIndex !== 'number' || optionIndex < 0) {
      return Response.json(
        { error: 'Invalid optionIndex' },
        { status: 400 }
      );
    }

    if (!db) {
      return Response.json(
        { error: 'Firebase not initialized' },
        { status: 503 }
      );
    }

    const predictionRef = db.collection('predictions').doc(predictionId);
    const predictionSnap = await predictionRef.get();

    if (!predictionSnap.exists) {
      // Allow first vote to create the prediction doc (used for "current match" predictions)
      if (!question || !matchDate || !options || !Array.isArray(options) || options.length === 0) {
        return Response.json(
          { error: 'Prediction not found and missing creation fields (question, matchDate, options)' },
          { status: 404 }
        );
      }

      if (optionIndex >= options.length) {
        return Response.json(
          { error: 'optionIndex out of range' },
          { status: 400 }
        );
      }

      const normalizedOptions = options
        .map((opt) => (typeof opt === 'string' ? opt : opt?.name))
        .filter((name): name is string => typeof name === 'string' && name.trim().length > 0)
        .map((name) => ({ name: name.trim(), votes: 0 }));

      if (normalizedOptions.length === 0) {
        return Response.json(
          { error: 'No valid options provided' },
          { status: 400 }
        );
      }

      await predictionRef.set({
        question,
        matchDate,
        options: normalizedOptions,
        totalVotes: 0,
        createdAt: new Date(),
        lastUpdated: new Date(),
      });
    }

    const freshSnap = predictionSnap.exists ? predictionSnap : await predictionRef.get();
    const data = freshSnap.data() as { options?: unknown } | undefined;

    // Normalize options regardless of Firestore storage shape (array vs map)
    let normalizedStoredOptions = normalizeOptions(data?.options);

    // Backfill options for older docs that exist but have no options saved
    if (normalizedStoredOptions.length === 0 && Array.isArray(options) && options.length > 0) {
      const backfill = options
        .map((opt) => (typeof opt === 'string' ? opt : opt?.name))
        .filter((name): name is string => typeof name === 'string' && name.trim().length > 0)
        .map((name) => ({ name: name.trim(), votes: 0 }));

      if (backfill.length > 0) {
        await predictionRef.set(
          {
            question: question ?? (freshSnap.data() as any)?.question ?? '',
            matchDate: matchDate ?? (freshSnap.data() as any)?.matchDate ?? '',
            options: backfill,
            lastUpdated: new Date(),
          },
          { merge: true }
        );

        const refetched = await predictionRef.get();
        normalizedStoredOptions = normalizeOptions((refetched.data() as any)?.options);
      }
    }

    if (normalizedStoredOptions.length > 0 && optionIndex >= normalizedStoredOptions.length) {
      return Response.json(
        { error: 'optionIndex out of range' },
        { status: 400 }
      );
    }

    // Update vote count for the selected option
    const voteField = `options.${optionIndex}.votes`;
    await predictionRef.update({
      [voteField]: admin.firestore.FieldValue.increment(1),
      totalVotes: admin.firestore.FieldValue.increment(1),
      lastUpdated: new Date(),
    });

    // Track user vote (optional)
    if (userId && userId !== 'anonymous') {
      const userVoteRef = db.collection('userVotes').doc(`${userId}_${predictionId}`);
      try {
        await userVoteRef.update({
          optionIndex,
          votedAt: new Date(),
        });
      } catch (error) {
        // Create new document if it doesn't exist
        await userVoteRef.set({
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
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('Error recording vote:', error);
    return Response.json(
      { error: 'Failed to record vote', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get('predictionId');

    if (!db) {
      return Response.json(
        { error: 'Firebase not initialized' },
        { status: 503 }
      );
    }

    // If predictionId provided, fetch single prediction
    if (predictionId) {
      const predictionRef = db.collection('predictions').doc(predictionId);
      const predictionSnap = await predictionRef.get();

      if (!predictionSnap.exists) {
        return Response.json(
          { error: 'Prediction not found' },
          { status: 404 }
        );
      }

      const data = predictionSnap.data() as any;
      const options = normalizeOptions(data?.options);

      return Response.json(
        {
          id: predictionId,
          question: data?.question || '',
          options,
          totalVotes: typeof data?.totalVotes === 'number' ? data.totalVotes : 0,
          matchDate: data?.matchDate || '',
        },
        { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    // If no predictionId, fetch all predictions
    const predictionsSnapshot = await db.collection('predictions').get();
    console.log(`Found ${predictionsSnapshot.size} predictions in Firestore`);
    
    const predictions = predictionsSnapshot.docs
      .map(doc => {
        const data = doc.data();
        console.log(`Prediction ${doc.id} raw data:`, data);

        const options = normalizeOptions((data as any)?.options);
        
        return {
          id: doc.id,
          question: data.question || '',
          options,
          totalVotes: typeof data.totalVotes === 'number' ? data.totalVotes : 0,
          matchDate: data.matchDate || '',
        };
      })
      // Sort by numeric IDs when possible; otherwise keep stable order
      .sort((a, b) => {
        const ai = Number(a.id);
        const bi = Number(b.id);
        if (Number.isFinite(ai) && Number.isFinite(bi)) return ai - bi;
        if (Number.isFinite(ai)) return -1;
        if (Number.isFinite(bi)) return 1;
        return String(a.id).localeCompare(String(b.id));
      });

    console.log('Returning formatted predictions:', predictions);
    return Response.json(
      { predictions },
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return Response.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}
