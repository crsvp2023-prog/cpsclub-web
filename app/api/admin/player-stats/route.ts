import { admin, db } from "@/app/lib/firebase-admin";

export const runtime = "nodejs";

const DEFAULT_ADMIN_EMAIL = "crsvp.2023@gmail.com";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function parseCsvEnv(value: string | undefined) {
  return (value || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

const ADMIN_EMAILS = new Set(
  (parseCsvEnv(process.env.ADMIN_EMAILS).length ? parseCsvEnv(process.env.ADMIN_EMAILS) : [DEFAULT_ADMIN_EMAIL]).map(
    normalizeEmail
  )
);

const ADMIN_UIDS = new Set(parseCsvEnv(process.env.ADMIN_UIDS));

async function requireAdmin(request: Request) {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;

  if (!token) {
    return { ok: false as const, status: 401, error: "Missing Authorization bearer token" };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    if (ADMIN_UIDS.has(decoded.uid)) {
      return { ok: true as const, email: null as any };
    }

    let email = typeof (decoded as any)?.email === "string" ? (decoded as any).email : undefined;
    if (!email) {
      try {
        const userRecord = await admin.auth().getUser(decoded.uid);
        email = userRecord.email || undefined;
      } catch {
        // ignore; handled below
      }
    }

    const normalized = normalizeEmail(email || "");

    if (!normalized) {
      return { ok: false as const, status: 403, error: "Token missing email" };
    }

    if (normalized && !ADMIN_EMAILS.has(normalized)) {
      return { ok: false as const, status: 403, error: "Admin access required" };
    }

    return { ok: true as const, email: normalized };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false as const, status: 401, error: "Invalid token", details: message };
  }
}

type PlayerStats = {
  matchesPlayed?: number;
  runsScored?: number;
  wickets?: number;
  battingAverage?: number;
  strikeRate?: number;
};

type PlayerStatsRecord = {
  email?: string;
  playCricketUrl?: string;
  stats?: PlayerStats;
};

export async function GET(request: Request) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) {
      return Response.json({ error: adminCheck.error, details: (adminCheck as any).details }, { status: adminCheck.status });
    }

    const url = new URL(request.url);
    const emailParam = url.searchParams.get("email");

    if (!emailParam) {
      return Response.json({ error: "Missing email parameter" }, { status: 400 });
    }

    if (!db) {
      return Response.json({ error: "Database not available" }, { status: 503 });
    }

    const docId = normalizeEmail(emailParam);
    const docSnap = await db.collection("playerStats").doc(docId).get();

    if (!docSnap.exists) {
      return Response.json(
        {
          exists: false,
          docId,
          projectId: (admin.app()?.options as any)?.projectId,
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        exists: true,
        id: docSnap.id,
        docId,
        projectId: (admin.app()?.options as any)?.projectId,
        ...docSnap.data(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin GET player stats error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: "Failed to fetch player stats", details: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) {
      return Response.json({ error: adminCheck.error, details: (adminCheck as any).details }, { status: adminCheck.status });
    }

    if (!db) {
      return Response.json({ error: "Database not available" }, { status: 503 });
    }

    const body = (await request.json()) as PlayerStatsRecord & { email?: string };
    const email = normalizeEmail(body?.email || "");

    if (!email) {
      return Response.json({ error: "Missing email in request body" }, { status: 400 });
    }

    const ref = db.collection("playerStats").doc(email);
    const existing = await ref.get();

    const payload: any = {
      email,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const playCricketUrl = typeof body?.playCricketUrl === "string" ? body.playCricketUrl.trim() : "";
    if (playCricketUrl) {
      payload.playCricketUrl = playCricketUrl;
    }

    if (body?.stats && typeof body.stats === "object") {
      const stats: any = {};
      if (typeof (body.stats as any).matchesPlayed === "number") stats.matchesPlayed = (body.stats as any).matchesPlayed;
      if (typeof (body.stats as any).runsScored === "number") stats.runsScored = (body.stats as any).runsScored;
      if (typeof (body.stats as any).wickets === "number") stats.wickets = (body.stats as any).wickets;
      if (typeof (body.stats as any).battingAverage === "number") stats.battingAverage = (body.stats as any).battingAverage;
      if (typeof (body.stats as any).strikeRate === "number") stats.strikeRate = (body.stats as any).strikeRate;
      if (Object.keys(stats).length > 0) {
        payload.stats = stats;
      }
    }

    if (!existing.exists) {
      payload.createdAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await ref.set(payload, { merge: true });

    return Response.json(
      {
        ok: true,
        docId: email,
        projectId: (admin.app()?.options as any)?.projectId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin POST player stats error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: "Failed to save player stats", details: message }, { status: 500 });
  }
}
