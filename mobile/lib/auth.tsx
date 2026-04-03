import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth';

import { firebaseApp } from '@/lib/firebase';

// Initialize Auth once with RN persistence.
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

type AuthContextValue = {
  firebaseUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken?: string, accessToken?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      isLoading,
      login: async (email, password) => {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      },
      signup: async (email, password) => {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      },
      loginWithGoogle: async (idToken, accessToken) => {
        if (!idToken && !accessToken) {
          throw new Error('Missing Google token');
        }
        const credential = GoogleAuthProvider.credential(idToken ?? undefined, accessToken ?? undefined);
        await signInWithCredential(auth, credential);
      },
      logout: async () => {
        await signOut(auth);
      },
    }),
    [firebaseUser, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
