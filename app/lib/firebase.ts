import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

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
const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);

// Initialize test app for cpsc-news
let testApp;
try {
  testApp = apps.find(a => a.name === "test") || initializeApp(firebaseTestConfig, "test");
} catch (error) {
  console.error("Error initializing test app:", error);
  testApp = app; // Fallback to main app
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore for both projects
export const db = getFirestore(app);
export const dbTest = getFirestore(testApp);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics, app };
