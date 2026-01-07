import { admin } from "@/app/lib/firebase-admin";

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

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;

  if (!token) {
    return Response.json({ authenticated: false, isAdmin: false }, { status: 200 });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    let email = typeof (decoded as any)?.email === "string" ? (decoded as any).email : undefined;
    if (!email) {
      try {
        const userRecord = await admin.auth().getUser(decoded.uid);
        email = userRecord.email || undefined;
      } catch {
        // ignore
      }
    }

    const normalized = normalizeEmail(email || "");
    const isAdmin = ADMIN_UIDS.has(decoded.uid) || (normalized ? ADMIN_EMAILS.has(normalized) : false);

    return Response.json(
      {
        authenticated: true,
        uid: decoded.uid,
        email: normalized || null,
        isAdmin,
      },
      { status: 200 }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ authenticated: false, isAdmin: false, error: message }, { status: 200 });
  }
}
