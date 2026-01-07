import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const useTestFirebase = process.env.NEXT_PUBLIC_USE_TEST_FIREBASE === "true";

// Production Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA8nY2HG-oxeECBg_oHy4ENMzxf0d2Q3tY",
  authDomain: "cps-club-374a5.firebaseapp.com",
  projectId: "cps-club-374a5",
  storageBucket: "cps-club-374a5.firebasestorage.app",
  messagingSenderId: "321293636814",
  appId: "1:321293636814:web:9cafa50433b661d4012c9f",
  measurementId: "G-7HD3QYL7QX",
};

// Test Firebase config (for cpsc-news collection)
const firebaseTestConfig = {
  apiKey: "AIzaSyB3LWNknYkF4jeNo8h0ANt8BMf0YK28LAk",
  authDomain: "cpsclub-test.firebaseapp.com",
  projectId: "cpsclub-test",
  storageBucket: "cpsclub-test.firebasestorage.app",
  messagingSenderId: "835986577910",
  appId: "1:835986577910:web:cb55e5065d7a61872bcfd7"
};

// Initialize Firebase - only if not already initialized
const apps = getApps();

// Always create named apps so we can deterministically pick prod vs test.
const prodApp = apps.find((a) => a.name === "prod") || initializeApp(firebaseConfig, "prod");

let testApp;
try {
  testApp = apps.find((a) => a.name === "test") || initializeApp(firebaseTestConfig, "test");
} catch (error) {
  console.error("Error initializing test app:", error);
  testApp = prodApp; // Safe fallback
}

// Primary app used by the website (auth/db/storage)
const app = useTestFirebase ? testApp : prodApp;

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  // Helpful debug to confirm which Firebase project the browser is using
  // (affects what Google shows as "continue to <authDomain>").
  console.log("[Firebase] Using project:", {
    useTestFirebase,
    projectId: (app.options as any)?.projectId,
    authDomain: (app.options as any)?.authDomain,
  });
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore for both projects
export const db = getFirestore(app);
export const dbTest = getFirestore(testApp);

// Helper: choose Firestore for features you want to test
// If NEXT_PUBLIC_USE_TEST_FIREBASE === 'true', use test Firestore; otherwise use production
export const meetupDb =
  useTestFirebase ? dbTest : db;

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== "undefined") {
  // Analytics requires measurementId; test config may not have it.
  if ((app.options as any)?.measurementId) {
    analytics = getAnalytics(app);
  }
}

export { analytics, app };
