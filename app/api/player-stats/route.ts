import { admin, db } from "@/app/lib/firebase-admin";

export const runtime = "nodejs";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/**
 * Manual "table" for mapping user email -> stats.
 * Firestore collection: playerStats
 * Doc ID: normalized email (lowercased)
 * Example doc fields:
 * - email: string (optional)
 * - playCricketUrl: string (optional)
 * - stats: {
 *     matchesPlayed?: number;
 *     runsScored?: number;
 *     wickets?: number;
 *     battingAverage?: number;
 *     strikeRate?: number;
 *   }
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const emailParam = url.searchParams.get("email");
    const debug = url.searchParams.get("debug") === "1";

    if (!emailParam) {
      return Response.json({ error: "Missing email parameter" }, { status: 400 });
    }

    if (!db) {
      return Response.json({ error: "Database not available" }, { status: 503 });
    }

    const docId = normalizeEmail(emailParam);
    const doc = await db.collection("playerStats").doc(docId).get();

    if (!doc.exists) {
      return Response.json(
        {
          exists: false,
          ...(debug
            ? {
                debug: {
                  projectId: (admin.app()?.options as any)?.projectId,
                  docPath: `playerStats/${docId}`,
                },
              }
            : null),
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        exists: true,
        id: doc.id,
        ...doc.data(),
        ...(debug
          ? {
              debug: {
                projectId: (admin.app()?.options as any)?.projectId,
                docPath: `playerStats/${docId}`,
              },
            }
          : null),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching player stats record:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: "Failed to fetch player stats", details: message }, { status: 500 });
  }
}
