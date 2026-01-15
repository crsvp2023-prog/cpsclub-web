import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/app/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MATCHES_DOC = db.collection('siteData').doc('matches');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matches, source } = body;

    if (!matches || !Array.isArray(matches)) {
      return NextResponse.json(
        { error: 'Invalid matches data. Expected an array of matches.' },
        { status: 400 }
      );
    }

    // Create the data structure
    const dataToSave = {
      matches,
      lastUpdated: new Date().toISOString(),
      source: source || 'Manual Update',
      totalMatches: matches.length
    };

    let wroteToFirestore = false;
    let wroteToFile = false;
    let fileWriteError: string | undefined;
    let firestoreWriteError: string | undefined;

    // Prefer Firestore for persistence (works on Vercel)
    try {
      await MATCHES_DOC.set(dataToSave, { merge: false });
      wroteToFirestore = true;
      console.log(`✅ Saved ${matches.length} matches to Firestore (siteData/matches)`);
    } catch (e) {
      firestoreWriteError = e instanceof Error ? e.message : 'Unknown Firestore error';
      console.error('Failed to write matches to Firestore:', e);
    }

    // Best-effort file write for local dev (may not persist on serverless)
    try {
      const dataDir = path.join(process.cwd(), 'public');
      const filePath = path.join(dataDir, 'matches-data.json');

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));
      wroteToFile = true;
      console.log(`✅ Saved ${matches.length} matches to file`);
    } catch (e) {
      fileWriteError = e instanceof Error ? e.message : 'Unknown file write error';
      console.error('Failed to write matches to file:', e);
    }

    if (!wroteToFirestore && !wroteToFile) {
      return NextResponse.json(
        {
          error: 'Failed to update matches',
          details: {
            firestore: firestoreWriteError,
            file: fileWriteError,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${matches.length} matches`,
      data: dataToSave,
      persisted: {
        firestore: wroteToFirestore,
        file: wroteToFile,
      },
    });

  } catch (error) {
    console.error('Error updating matches:', error);
    return NextResponse.json(
      {
        error: 'Failed to update matches',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Prefer Firestore (persisted on Vercel)
    try {
      const snap = await MATCHES_DOC.get();
      if (snap.exists) {
        const data = snap.data();
        if (data && Array.isArray((data as any).matches)) {
          return NextResponse.json(
            {
              success: true,
              data,
              source: 'firestore',
            },
            { headers: { 'Cache-Control': 'no-store, max-age=0' } }
          );
        }
      }
    } catch (e) {
      // fall through to file
      console.warn('Failed to read matches from Firestore, falling back to file:', e);
    }

    // Fallback: file (local dev)
    const dataDir = path.join(process.cwd(), 'public');
    const filePath = path.join(dataDir, 'matches-data.json');

    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return NextResponse.json(
        {
          success: true,
          data,
          source: 'file',
        },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'No matches data found',
      },
      { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('Error reading matches:', error);
    return NextResponse.json(
      {
        error: 'Failed to read matches',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}