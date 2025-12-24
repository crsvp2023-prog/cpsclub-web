import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore;
let adminApp: admin.app.App;

// Initialize Firebase Admin SDK
try {
  if (!admin.apps.length) {
    // Get service account from environment variable
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
      : undefined;

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
