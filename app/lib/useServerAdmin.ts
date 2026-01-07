"use client";

import { useEffect, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";

export function useServerAdmin(isAuthenticated: boolean, firebaseUser: FirebaseUser | null) {
  const [serverIsAdmin, setServerIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [whoami, setWhoami] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!isAuthenticated || !firebaseUser) {
        setServerIsAdmin(null);
        setWhoami(null);
        return;
      }

      setChecking(true);
      try {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch("/api/admin/whoami", {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const data = await res.json().catch(() => null);
        if (cancelled) return;
        setWhoami(data);
        setServerIsAdmin(!!data?.isAdmin);
      } catch {
        if (cancelled) return;
        setWhoami(null);
        setServerIsAdmin(null);
      } finally {
        if (cancelled) return;
        setChecking(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, firebaseUser]);

  return { serverIsAdmin, checking, whoami };
}
