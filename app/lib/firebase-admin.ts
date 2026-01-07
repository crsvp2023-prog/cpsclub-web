import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore;
let adminApp: admin.app.App;

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

    if (!serviceAccount) {
      console.warn(
        'WARNING: Firebase Admin SDK not initialized - FIREBASE_SERVICE_ACCOUNT environment variable not set. ' +
        'Server-side Firestore operations will fail. ' +
        'Download your service account key from Firebase Console and add it as FIREBASE_SERVICE_ACCOUNT env var.'
      );
      // Initialize with empty/dummy credentials for dev (will fail at runtime if used)
      adminApp = admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      console.log('Firebase Admin SDK initialized successfully');
    }
  } else {
    adminApp = admin.apps[0]!;
  }
  
  db = admin.firestore();
} catch (error) {
  console.error('Error setting up Firebase Admin:', error);
  // Create a dummy firestore instance that will error at runtime
  adminApp = admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
  db = admin.firestore();
}

export { admin, db };
