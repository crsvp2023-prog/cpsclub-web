import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Analytics endpoint disabled - Firebase Admin credentials not configured
    console.warn('Analytics request received but endpoint is disabled');
    return NextResponse.json({ success: false, message: 'Analytics endpoint disabled' }, { status: 200 });
  } catch (error) {
    console.error('Error in analytics endpoint:', error);
    return NextResponse.json(
      { error: 'Analytics endpoint not available' },
      { status: 503 }
    );
  }
}
