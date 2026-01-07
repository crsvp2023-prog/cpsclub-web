import { admin, db } from "@/app/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const app = admin.apps[0];
    const projectId = app ? ((app.options as any)?.projectId as string | undefined) : undefined;

    return Response.json(
      {
        status: "ok",
        adminInitialized: admin.apps.length > 0,
        firestoreInitialized: !!db,
        projectId: projectId || null,
        envProjectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || null,
        hasServiceAccountBase64: !!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
        hasServiceAccountJson: !!process.env.FIREBASE_SERVICE_ACCOUNT,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      {
        status: "error",
        message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
