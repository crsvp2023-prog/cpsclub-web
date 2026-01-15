import { db, getAdminAuthForToken } from "@/app/lib/firebase-admin";

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
    const auth = getAdminAuthForToken(token);
    const decoded = await auth.verifyIdToken(token);

    if (ADMIN_UIDS.has(decoded.uid)) {
      return { ok: true as const };
    }

    let email = typeof (decoded as any)?.email === "string" ? (decoded as any).email : undefined;
    if (!email) {
      try {
        const userRecord = await auth.getUser(decoded.uid);
        email = userRecord.email || undefined;
      } catch {
        // ignore; handled below
      }
    }

    const normalized = normalizeEmail(email || "");

    if (!normalized) {
      return { ok: false as const, status: 403, error: "Token missing email" };
    }

    if (!ADMIN_EMAILS.has(normalized)) {
      return { ok: false as const, status: 403, error: "Admin access required" };
    }

    return { ok: true as const };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false as const, status: 401, error: "Invalid token", details: message };
  }
}

export async function GET(request: Request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) {
    return Response.json({ error: adminCheck.error, details: (adminCheck as any).details }, { status: adminCheck.status });
  }

  if (!db) {
    return Response.json({ error: "Database not available" }, { status: 503 });
  }

  try {
    const snap = await db.collection("newsletter_subscribers").orderBy("subscribedAt", "desc").get();

    const subscribers = snap.docs.map((doc) => {
      const data = doc.data() as any;
      const subscribedAt = data?.subscribedAt;
      const subscribedAtMs = typeof subscribedAt?.toMillis === "function" ? subscribedAt.toMillis() : null;

      return {
        id: doc.id,
        email: typeof data?.email === "string" ? data.email : "",
        firstName: typeof data?.firstName === "string" ? data.firstName : "",
        status: typeof data?.status === "string" ? data.status : "",
        subscribedAt: subscribedAtMs,
      };
    });

    return Response.json({ subscribers }, { status: 200 });
  } catch (e) {
    console.error("Admin GET newsletter subscribers error:", e);
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: "Failed to fetch subscribers", details: message }, { status: 500 });
  }
}
