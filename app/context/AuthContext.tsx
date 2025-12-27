"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: string;
  experience?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  signup: (email: string, name: string, phone?: string, role?: string) => Promise<FirebaseUser | null>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is signed in, set basic user info from Firebase Auth
        setUser({
          id: currentUser.uid,
          email: currentUser.email || "",
          name: currentUser.displayName || "",
        });
      } else {
        setUser(null);
      }
      setFirebaseUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper function to update user profile in database
  const updateUserProfile = useCallback(async (
    uid: string,
    email: string,
    displayName?: string,
    photoURL?: string,
    phone?: string,
    role?: string
  ) => {
    // Don't throw - profile update is optional and secondary to login
    // Attempt to update, but catch and log any errors without blocking
    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          email,
          displayName,
          photoURL,
          phone,
          role: role || "member",
        }),
      });

      if (!response.ok) {
        console.warn("Profile update returned non-200 status:", response.status);
        try {
          const errorText = await response.text();
          console.warn("Profile update response:", errorText);
          
          if (errorText) {
            try {
              const errorData = JSON.parse(errorText);
              console.error("Profile update error:", {
                status: response.status,
                error: errorData.error,
                details: errorData.details,
              });
            } catch {
              console.warn("Response was not JSON:", errorText.substring(0, 100));
            }
          }
        } catch (readError) {
          console.warn("Could not read response body:", readError);
        }
      } else {
        try {
          const data = await response.json();
          console.log("Profile update successful");
        } catch {
          console.log("Profile update successful (no JSON response)");
        }
      }
    } catch (fetchError) {
      console.warn("Profile update fetch failed:", fetchError instanceof Error ? fetchError.message : String(fetchError));
    }
  }, []);

  const signup = useCallback(async (
    email: string, 
    name: string,
    phone?: string,
    role?: string
  ) => {
    setIsLoading(true);
    try {
      // Generate a random password
      const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, randomPassword);
      const newUser = userCredential.user;

      // Save user profile via API
      try {
        await updateUserProfile(
          newUser.uid,
          email,
          name,
          undefined,
          phone,
          role
        );
      } catch (profileError) {
        console.error("Warning: Could not save profile to Firestore:", profileError);
        // Continue anyway - user is still created in Firebase Auth
      }

      setUser({
        id: newUser.uid,
        email,
        name,
        phone,
        role: role || "member",
      });
      
      return newUser;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [updateUserProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Update user profile in database
      await updateUserProfile(
        userCredential.user.uid,
        userCredential.user.email || email
      );
      // Auth state listener will handle setting user data
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [updateUserProfile]);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      console.log("Google login successful:", {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      });
      
      // Try to update user profile in database with Google data
      // Even if this fails, the user is still logged in
      try {
        await updateUserProfile(
          userCredential.user.uid,
          userCredential.user.email || "",
          userCredential.user.displayName || undefined,
          userCredential.user.photoURL || undefined
        );
      } catch (profileError) {
        // Log but don't fail - user is already authenticated
        console.warn("Profile update failed but user is authenticated:", profileError);
      }
      
      // Auth state listener will handle setting user data
    } catch (error: any) {
      // Ignore popup-closed-by-user error (user cancelled)
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Google login cancelled by user");
        setIsLoading(false);
        return;
      }
      console.error("Google login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [updateUserProfile]);

  const loginWithFacebook = useCallback(async () => {
    setIsLoading(true);
    try {
      const provider = new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Try to update user profile in database with Facebook data
      // Even if this fails, the user is still logged in
      try {
        await updateUserProfile(
          userCredential.user.uid,
          userCredential.user.email || "",
          userCredential.user.displayName || undefined,
          userCredential.user.photoURL || undefined
        );
      } catch (profileError) {
        // Log but don't fail - user is already authenticated
        console.warn("Profile update failed but user is authenticated:", profileError);
      }
      
      // Auth state listener will handle setting user data
    } catch (error: any) {
      // Ignore popup-closed-by-user error (user cancelled)
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Facebook login cancelled by user");
        setIsLoading(false);
        return;
      }
      console.error("Facebook login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [updateUserProfile]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        signup,
        login,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        isAuthenticated: !!firebaseUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext };
