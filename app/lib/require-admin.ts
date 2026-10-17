import { getAdminAuthForToken } from "@/app/lib/firebase-admin";

const DEFAULT_ADMIN_EMAIL = "crsvp.2023@gmail.com";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function parseCsvEnv(value: string | undefined) {
  return (value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

const ADMIN_EMAILS = new Set(
  (parseCsvEnv(process.env.ADMIN_EMAILS).length
    ? parseCsvEnv(process.env.ADMIN_EMAILS)
    : [DEFAULT_ADMIN_EMAIL]
  ).map(normalizeEmail)
);
const ADMIN_UIDS = new Set(parseCsvEnv(process.env.ADMIN_UIDS));

export async function requireAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : "";

  if (!token) {
    return { ok: false as const, status: 401, error: "Missing Authorization bearer token" };
  }

  try {
    const auth = getAdminAuthForToken(token);
    const decoded = await auth.verifyIdToken(token);

    if (ADMIN_UIDS.has(decoded.uid)) {
      return { ok: true as const };
    }

    let email = typeof decoded.email === "string" ? decoded.email : "";
    if (!email) {
      try {
        email = (await auth.getUser(decoded.uid)).email || "";
      } catch {
        email = "";
      }
    }

    if (!email || !ADMIN_EMAILS.has(normalizeEmail(email))) {
      return { ok: false as const, status: 403, error: "Admin access required" };
    }

    return { ok: true as const };
  } catch {
    return { ok: false as const, status: 401, error: "Invalid token" };
  }
}
