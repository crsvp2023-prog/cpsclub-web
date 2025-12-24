import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA8nY2HG-oxeECBg_oHy4ENMzxf0d2Q3tY",
  authDomain: "cps-club-374a5.firebaseapp.com",
  projectId: "cps-club-374a5",
  storageBucket: "cps-club-374a5.firebasestorage.app",
  messagingSenderId: "321293636814",
  appId: "1:321293636814:web:9cafa50433b661d4012c9f",
  measurementId: "G-7HD3QYL7QX",
};

// Initialize Firebase - only if not already initialized
const apps = getApps();
const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics, app };
