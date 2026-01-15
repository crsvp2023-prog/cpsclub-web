import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore;
let adminApp: admin.app.App;
let testAdminApp: admin.app.App | null = null;

// Initialize Firebase Admin SDK
try {
  if (!admin.apps.length) {
    // Get service account from environment variable
    // Prefer base64 to avoid newline/control-character issues in env parsing.
    let serviceAccount: any;

    const tryParseServiceAccount = (raw: string) => {
      try {
        return JSON.parse(raw);
      } catch {
        // If the env var contains literal newlines (common when copy/pasting keys),
        // JSON.parse will fail with "Bad control character".
        // Try a best-effort sanitization by escaping newlines.
        const sanitized = raw.replace(/\r\n/g, "\\n").replace(/\n/g, "\\n").replace(/\r/g, "\\n");
        return JSON.parse(sanitized);
      }
    };

    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      try {
        const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
        serviceAccount = tryParseServiceAccount(decoded);
      } catch (e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64:', e);
        serviceAccount = undefined;
      }
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = tryParseServiceAccount(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch (e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', e);
        serviceAccount = undefined;
      }
    } else {
      serviceAccount = undefined;
    }

    const resolvedProjectId =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      (serviceAccount && typeof serviceAccount.project_id === 'string' ? serviceAccount.project_id : undefined);

    // Optional: a second Admin app for the test Firebase project.
    // This allows server routes to verify ID tokens minted by the test project
    // when the browser switches via NEXT_PUBLIC_USE_TEST_FIREBASE.
    let testServiceAccount: any;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_TEST_BASE64) {
      try {
        const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_TEST_BASE64, 'base64').toString('utf8');
        testServiceAccount = tryParseServiceAccount(decoded);
      } catch (e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_TEST_BASE64:', e);
        testServiceAccount = undefined;
      }
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_TEST) {
      try {
        testServiceAccount = tryParseServiceAccount(process.env.FIREBASE_SERVICE_ACCOUNT_TEST);
      } catch (e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_TEST:', e);
        testServiceAccount = undefined;
      }
    } else {
      testServiceAccount = undefined;
    }

    const resolvedTestProjectId =
      process.env.FIREBASE_PROJECT_ID_TEST ||
      (testServiceAccount && typeof testServiceAccount.project_id === 'string' ? testServiceAccount.project_id : undefined) ||
      // Known test project from client config; used only as a fallback.
      'cpsclub-test';

    if (!serviceAccount) {
      console.warn(
        'WARNING: Firebase Admin SDK not initialized - FIREBASE_SERVICE_ACCOUNT environment variable not set. ' +
        'Server-side Firestore operations will fail. ' +
        'Download your service account key from Firebase Console and add it as FIREBASE_SERVICE_ACCOUNT env var.'
      );
      // Initialize with empty/dummy credentials for dev (will fail at runtime if used)
      adminApp = admin.initializeApp({
        projectId: resolvedProjectId,
      });
    } else {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: resolvedProjectId,
      });
      console.log('Firebase Admin SDK initialized successfully');
    }

    // Initialize optional test admin app (named) so we can verify test-project ID tokens.
    // If no credentials are provided, token verification can still work; privileged ops will fail.
    try {
      const shouldInitTestApp =
        Boolean(process.env.FIREBASE_PROJECT_ID_TEST) ||
        Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_TEST) ||
        Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_TEST_BASE64) ||
        process.env.NEXT_PUBLIC_USE_TEST_FIREBASE === 'true';

      if (shouldInitTestApp) {
        const existing = admin.apps.find((a) => a?.name === 'test');
        if (existing) {
          testAdminApp = existing;
        } else if (testServiceAccount) {
          testAdminApp = admin.initializeApp(
            {
              credential: admin.credential.cert(testServiceAccount),
              projectId: resolvedTestProjectId,
            },
            'test'
          );
        } else {
          testAdminApp = admin.initializeApp(
            {
              projectId: resolvedTestProjectId,
            },
            'test'
          );
        }
      }
    } catch (e) {
      console.error('Failed to initialize Firebase test Admin app:', e);
      testAdminApp = null;
    }
  } else {
    adminApp = admin.apps[0]!;
  }
  
  db = admin.firestore();
} catch (error) {
  console.error('Error setting up Firebase Admin:', error);
  // Fallback: avoid double-initializing the default app if it was partially created.
  if (!admin.apps.length) {
    adminApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } else {
    adminApp = admin.apps[0]!;
  }

  db = admin.firestore();
}

export { admin, db };

function decodeJwtPayload(token: string): Record<string, any> | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;

  const payload = parts[1]!;
  // base64url decode
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  try {
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getAdminAuthForToken(token: string): admin.auth.Auth {
  const payload = decodeJwtPayload(token);
  const aud = typeof payload?.aud === 'string' ? payload.aud : undefined;

  if (aud && testAdminApp) {
    const testProjectId = testAdminApp.options?.projectId;
    if (testProjectId && aud === testProjectId) {
      return testAdminApp.auth();
    }
  }

  // Default to the primary admin app.
  return admin.auth();
}
