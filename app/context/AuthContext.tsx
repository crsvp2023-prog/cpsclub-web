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
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: string;
  experience?: string;
  photoURL?: string;
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

  // Helper function to fetch user profile from database
  const fetchUserProfile = useCallback(async (uid: string) => {
    try {
      const response = await fetch(`/api/auth/get-profile?uid=${uid}`);
      if (response.ok) {
        const profileData = await response.json();
        return profileData;
      } else if (response.status === 503) {
        console.log("Database not available, using Firebase Auth data only");
        return null;
      }
    } catch (error) {
      console.warn("Failed to fetch user profile:", error);
    }
    return null;
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // First set basic user info from Firebase Auth
        const basicUser = {
          id: currentUser.uid,
          email: currentUser.email || "",
          name: currentUser.displayName || "",
        };

        // Try to fetch additional profile data from database
        const profileData = await fetchUserProfile(currentUser.uid);
        if (profileData && profileData.displayName) {
          // Use profile data from database if it exists and has a name
          setUser({
            id: currentUser.uid,
            email: profileData.email || basicUser.email,
            name: profileData.displayName,
            phone: profileData.phone,
            role: profileData.role,
            experience: profileData.experience,
          });
        } else if (basicUser.name) {
          // Use Firebase Auth displayName if available
          setUser(basicUser);
        } else {
          // No name available - user needs to update profile
          setUser({
            ...basicUser,
            name: "User", // Default name to prevent empty name errors
          });
        }
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
          ...(email && { email }),
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
              // Only log if errorData has meaningful content
              if (errorData && (errorData.error || errorData.details)) {
                console.error("Profile update error:", {
                  status: response.status,
                  error: errorData.error,
                  details: errorData.details,
                });
              } else {
                console.warn("Profile update error: Empty or uninformative error object", errorData);
              }
            } catch {
              console.warn("Response was not JSON:", errorText.substring(0, 100));
            }
          } else {
            console.warn("Profile update error: Empty response body");
          }
        } catch (readError) {
          console.warn("Could not read response body:", readError);
        }
      } else {
        try {
          const data = await response.json();
          console.log("Profile update successful:", data.message || "Profile updated");
        } catch {
          console.log("Profile update successful (no JSON response)");
        }
      }
    } catch (fetchError) {
      console.warn("Profile update fetch failed:", fetchError instanceof Error ? fetchError.message : String(fetchError));
    }
  }, []);

  // Complete OAuth redirect flows (used as a fallback when popups are blocked)
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!isMounted || !result?.user) return;

        try {
          await updateUserProfile(
            result.user.uid,
            result.user.email || "",
            result.user.displayName || undefined,
            result.user.photoURL || undefined
          );
        } catch (profileError) {
          console.warn("Profile update failed after redirect login:", profileError);
        }
      } catch (error) {
        // Don't throw here; redirect errors shouldn't break app render
        console.error("OAuth redirect result error:", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [updateUserProfile]);

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

      // Update the Firebase Auth user's display name
      try {
        await updateProfile(newUser, {
          displayName: name,
        });
        console.log("Firebase Auth displayName updated successfully");
      } catch (displayNameError) {
        console.warn("Could not update Firebase Auth displayName:", displayNameError);
      }

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
      provider.setCustomParameters({ prompt: "select_account" });

      let userCredential;
      try {
        userCredential = await signInWithPopup(auth, provider);
      } catch (error: any) {
        // If popups are blocked (common in production/Safari/mobile), fall back to redirect.
        if (
          error?.code === "auth/popup-blocked" ||
          error?.code === "auth/operation-not-supported-in-this-environment"
        ) {
          await signInWithRedirect(auth, provider);
          return;
        }
        throw error;
      }
      
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

      let userCredential;
      try {
        userCredential = await signInWithPopup(auth, provider);
      } catch (error: any) {
        if (
          error?.code === "auth/popup-blocked" ||
          error?.code === "auth/operation-not-supported-in-this-environment"
        ) {
          await signInWithRedirect(auth, provider);
          return;
        }
        throw error;
      }
      
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
