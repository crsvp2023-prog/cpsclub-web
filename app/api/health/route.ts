import { admin, db } from "@/app/lib/firebase-admin";

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log("Health check: Testing Firestore connection...");

    const app = admin.apps[0];
    const projectId = app ? ((app.options as any)?.projectId as string | undefined) : undefined;
    
    // Try to read from a collection
    const snapshot = await db?.collection("users").limit(1).get();
    
    console.log("Health check: Firestore connection successful!");
    console.log("Health check: Firestore database instance:", !!db);
    
    return Response.json(
      {
        status: "healthy",
        message: "Firestore connection successful",
        timestamp: new Date().toISOString(),
        firestoreInitialized: !!db,
        projectId: projectId || null,
        adminInitialized: admin.apps.length > 0,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = (error as any)?.code;
    
    console.error("Health check failed:", {
      message: errorMessage,
      code: errorCode,
      error: error,
    });
    
    return Response.json(
      {
        status: "unhealthy",
        message: "Firestore connection failed",
        error: errorMessage,
        code: errorCode,
        firestoreInitialized: !!db,
        adminInitialized: admin.apps.length > 0,
      },
      { status: 500 }
    );
  }
}
