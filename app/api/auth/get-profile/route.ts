import { db } from "@/app/lib/firebase-admin";

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const uid = url.searchParams.get('uid');

    if (!uid) {
      return Response.json(
        { error: "Missing uid parameter" },
        { status: 400 }
      );
    }

    // Check if Firebase Admin is properly initialized
    if (!db) {
      return Response.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    // Reference to user document
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return Response.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    return Response.json(userData);

  } catch (error) {
    console.error("Error fetching user profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorCode = error instanceof Error ? error.name : "UNKNOWN_ERROR";

    return Response.json(
      {
        error: "Failed to fetch user profile",
        details: errorMessage,
        code: errorCode,
      },
      { status: 500 }
    );
  }
}