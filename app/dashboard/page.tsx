"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { storage } from "@/app/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { logAnalyticsEvent } from "@/app/lib/analytics";
import { UPCOMING_MATCHES } from "../data/upcoming-matches";

const MERCH_SIZES = ["8", "10", "12", "14", "XS", "S", "M", "L", "XL", "2XL", "3XL"];

const FALLBACK_UID_EMAILS: Record<string, string> = {
  "qH0sMkxxB4Xzp5vxhaVoXDP7s163": "ravip.2006@gmail.com",
};

export default function DashboardPage() {
  const { user, firebaseUser, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const ADMIN_EMAIL = "crsvp.2023@gmail.com";
  const [tokenEmail, setTokenEmail] = useState("");
  const [tokenName, setTokenName] = useState("");
  const providerEmail =
    (firebaseUser?.providerData || []).find((p) => typeof p?.email === "string" && p.email.trim())?.email || "";
  const effectiveUid = (user?.id || firebaseUser?.uid || "").trim();
  const [profileEmailFallback, setProfileEmailFallback] = useState("");
  const rawEmail = (user?.email || firebaseUser?.email || providerEmail || "").trim();
  const uidFallbackEmail = effectiveUid && FALLBACK_UID_EMAILS[effectiveUid] ? FALLBACK_UID_EMAILS[effectiveUid] : "";
  const resolvedEmail = (rawEmail || tokenEmail || uidFallbackEmail).trim();
  const effectiveEmail = resolvedEmail.toLowerCase();
  const emailIsAdmin = effectiveEmail === ADMIN_EMAIL.trim().toLowerCase();
  const [serverIsAdmin, setServerIsAdmin] = useState<boolean | null>(null);
  const [serverWhoami, setServerWhoami] = useState<any>(null);
  const isAdmin = emailIsAdmin || serverIsAdmin === true;
  const [debugAdmin, setDebugAdmin] = useState(false);
  const serverEmail = typeof serverWhoami?.email === "string" ? serverWhoami.email : "";
  const displayEmail = resolvedEmail || serverEmail || profileEmailFallback;
  const profileName = typeof user?.name === "string" ? user.name.trim() : "";
  const displayName = profileName && profileName.toLowerCase() !== "user"
    ? profileName
    : (firebaseUser?.displayName || tokenName || profileName || "User");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [registeredMatches, setRegisteredMatches] = useState<any[]>([]);
  const [availableMatches, setAvailableMatches] = useState<any[]>([]);
  const [merchSubmitting, setMerchSubmitting] = useState(false);
  const [merchMessage, setMerchMessage] = useState<string | null>(null);
  const [merchError, setMerchError] = useState<string | null>(null);
  const [merchUniqueId, setMerchUniqueId] = useState<string | null>(null);
  const [activeStatsTab, setActiveStatsTab] = useState<"batting" | "bowling" | "fielding">("batting");
  const [merchForm, setMerchForm] = useState({
    email: "",
    phone: "",
    playerRegistration: "New Player",
    jerseySize: "",
    jerseyQuantity: 0,
    trouserSize: "",
    trouserQuantity: 0,
    hatsQuantity: 0,
  });

  const [emailStatsLoading, setEmailStatsLoading] = useState(false);
  const [emailStatsRecord, setEmailStatsRecord] = useState<null | {
    playCricketUrl?: string;
    summary?: {
      seasonLabel?: string;
      matchesPlayed?: number;
      runsScored?: number;
      battingAverage?: number;
      highScore?: number;
      wickets?: number;
      bowlingAverage?: number;
      bestBowling?: string;
      totalCatches?: number;
      wicketKeeperCatches?: number;
      nonWicketKeeperCatches?: number;
      runOuts?: number;
      stumpings?: number;
    };
    stats?: {
      matchesPlayed?: number;
      innings?: number;
      runsScored?: number;
      wickets?: number;
      battingAverage?: number;
      strikeRate?: number;
      highScore?: number;
      hundreds?: number;
      fifties?: number;
      ducks?: number;
      notOuts?: number;
      overs?: number;
      maidens?: number;
      bowlingRuns?: number;
      bestBowling?: string;
      bowlingAverage?: number;
      economy?: number;
      totalCatches?: number;
      wicketKeeperCatches?: number;
      nonWicketKeeperCatches?: number;
      runOuts?: number;
      stumpings?: number;
    };
  }>(null);

  const [myStatsLoading, setMyStatsLoading] = useState(false);
  const [myBattingStats, setMyBattingStats] = useState<null | {
    matches: number;
    innings: number;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    highest: number;
  }>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    // Opt-in debug for production troubleshooting: /dashboard?debugAdmin=1
    // Shows computed admin flags and emails to the logged-in user only.
    try {
      const params = new URLSearchParams(window.location.search);
      setDebugAdmin(params.get("debugAdmin") === "1");
    } catch {
      setDebugAdmin(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadTokenIdentity = async () => {
      if (!firebaseUser) {
        setTokenEmail("");
        setTokenName("");
        return;
      }

      try {
        const tokenResult = await firebaseUser.getIdTokenResult();
        if (cancelled) return;

        const claimEmail = typeof tokenResult?.claims?.email === "string" ? tokenResult.claims.email.trim() : "";
        const claimName = typeof tokenResult?.claims?.name === "string" ? tokenResult.claims.name.trim() : "";

        setTokenEmail(claimEmail);
        setTokenName(claimName);
      } catch {
        if (cancelled) return;
        setTokenEmail("");
        setTokenName("");
      }
    };

    loadTokenIdentity();
    return () => {
      cancelled = true;
    };
  }, [firebaseUser]);

  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async () => {
      if (!isAuthenticated || !firebaseUser) {
        setServerIsAdmin(null);
        return;
      }

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
        setServerWhoami(data);
        setServerIsAdmin(!!data?.isAdmin);
      } catch {
        if (cancelled) return;
        setServerWhoami(null);
        setServerIsAdmin(null);
      }
    };

    checkAdmin();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, firebaseUser]);

  useEffect(() => {
    let cancelled = false;

    const loadProfileEmailFallback = async () => {
      if (!effectiveUid) {
        setProfileEmailFallback("");
        return;
      }

      // Skip if we already have an email from auth/token/server.
      if (rawEmail || serverEmail || tokenEmail) {
        setProfileEmailFallback("");
        return;
      }

      try {
        const res = await fetch(`/api/auth/get-profile?uid=${encodeURIComponent(effectiveUid)}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          if (!cancelled) setProfileEmailFallback("");
          return;
        }

        const data = await res.json().catch(() => null);
        const fallbackEmail = typeof data?.email === "string" ? data.email.trim() : "";
        if (!cancelled) setProfileEmailFallback(fallbackEmail);
      } catch {
        if (!cancelled) setProfileEmailFallback("");
      }
    };

    loadProfileEmailFallback();
    return () => {
      cancelled = true;
    };
  }, [effectiveUid, rawEmail, serverEmail, tokenEmail]);

  useEffect(() => {
    const normalizeName = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

    const loadMyPlayerStats = async () => {
      if (!isAuthenticated || !displayName || displayName.toLowerCase() === "user") return;

      setMyStatsLoading(true);

      try {
        const response = await fetch("/api/update-matches", { cache: "no-store" });
        if (!response.ok) {
          setMyBattingStats(null);
          return;
        }

        const api = await response.json();
        const data = api?.success ? api.data : null;
        const matches = Array.isArray(data?.matches) ? data.matches : [];
        const target = normalizeName(displayName);

        let matchesCount = 0;
        let innings = 0;
        let runs = 0;
        let balls = 0;
        let fours = 0;
        let sixes = 0;
        let highest = 0;

        for (const match of matches) {
          const allBatting: any[] = [
            ...(match?.team1?.batting || []),
            ...(match?.team2?.batting || []),
          ];

          let matchedThisMatch = false;

          for (const entry of allBatting) {
            const entryName = typeof entry?.name === "string" ? normalizeName(entry.name) : "";
            if (!entryName || entryName !== target) continue;

            matchedThisMatch = true;
            innings += 1;
            const entryRuns = Number(entry?.runs) || 0;
            const entryBalls = Number(entry?.balls) || 0;
            const entryFours = Number(entry?.fours) || 0;
            const entrySixes = Number(entry?.sixes) || 0;

            runs += entryRuns;
            balls += entryBalls;
            fours += entryFours;
            sixes += entrySixes;
            if (entryRuns > highest) highest = entryRuns;
          }

          if (matchedThisMatch) matchesCount += 1;
        }

        if (innings === 0) {
          setMyBattingStats(null);
          return;
        }

        setMyBattingStats({
          matches: matchesCount,
          innings,
          runs,
          balls,
          fours,
          sixes,
          highest,
        });
      } catch (error) {
        console.warn("Failed to load player stats:", error);
        setMyBattingStats(null);
      } finally {
        setMyStatsLoading(false);
      }
    };

    loadMyPlayerStats();
  }, [isAuthenticated, displayName]);

  useEffect(() => {
    const loadEmailStats = async () => {
      const emailCandidate = (rawEmail || serverEmail || tokenEmail || profileEmailFallback || "").trim();
      const uidCandidate = effectiveUid;
      if (!isAuthenticated || (!emailCandidate && !uidCandidate)) {
        setEmailStatsRecord(null);
        return;
      }

      setEmailStatsLoading(true);
      try {
        const email = emailCandidate.toLowerCase();
        const qs = new URLSearchParams();
        if (email) qs.set("email", email);
        if (uidCandidate) qs.set("uid", uidCandidate);
        qs.set("live", "1");
        const idToken = firebaseUser ? await firebaseUser.getIdToken() : "";
        const res = await fetch(`/api/player-stats?${qs.toString()}`, {
          cache: "no-store",
          headers: idToken
            ? {
                Authorization: `Bearer ${idToken}`,
              }
            : undefined,
        });
        if (!res.ok) {
          setEmailStatsRecord(null);
          return;
        }

        const data = await res.json();
        if (!data?.exists) {
          setEmailStatsRecord(null);
          return;
        }

        setEmailStatsRecord({
          playCricketUrl: typeof data?.playCricketUrl === "string" ? data.playCricketUrl : undefined,
          summary: typeof data?.summary === "object" && data.summary ? data.summary : undefined,
          stats: typeof data?.stats === "object" && data.stats ? data.stats : undefined,
        });
      } catch (e) {
        console.warn("Failed to load email-based stats:", e);
        setEmailStatsRecord(null);
      } finally {
        setEmailStatsLoading(false);
      }
    };

    loadEmailStats();
  }, [isAuthenticated, rawEmail, serverEmail, tokenEmail, profileEmailFallback, firebaseUser, effectiveUid]);

  useEffect(() => {
    setProfileData((prev) => ({
      ...prev,
      email: displayEmail || prev.email,
      phone: user?.phone || prev.phone,
      name: displayName || prev.name,
    }));
  }, [displayEmail, displayName, user?.phone]);

  useEffect(() => {
    setMerchForm((prev) => ({
      ...prev,
      email: displayEmail || prev.email,
      phone: user?.phone || prev.phone,
    }));
  }, [displayEmail, user?.phone]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await logAnalyticsEvent("button_click", "logout", user?.id);
    await logout();
    router.push("/");
  };

  const handleEditProfile = () => {
    setActiveModal('editProfile');
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleChangePassword = () => {
    setActiveModal('changePassword');
    setProfileData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  const handleViewMatchHistory = () => {
    setActiveModal('matchHistory');
    // Mock data - in real app, fetch from API
    setMatchHistory([
      { id: 1, date: '2025-01-15', opponent: 'North Sydney', result: 'Won by 28 runs', score: '168/6' },
      { id: 2, date: '2025-01-08', opponent: 'Eastern Suburbs', result: 'Won by 18 runs', score: '152/7' }
    ]);
  };

  const handleViewRegisteredMatches = async () => {
    const normalizeName = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

    if (!displayName || displayName.toLowerCase() === 'user') {
      alert('User name is missing. Please log out and log back in.');
      return;
    }

    try {
      // We don’t have PlayHQ SSO in this app; instead we use PlayHQ-derived match data
      // and match the logged-in user's name against stored scorecards.
      const response = await fetch('/api/update-matches', { cache: 'no-store' });
      if (!response.ok) {
        alert('Could not load match data. Please try again.');
        return;
      }

      const api = await response.json();
      const data = api?.success ? api.data : null;
      const matches = Array.isArray(data?.matches) ? data.matches : [];
      const target = normalizeName(displayName);

      const myMatches = matches
        .filter((match: any) => {
          const batting: any[] = [
            ...(match?.team1?.batting || []),
            ...(match?.team2?.batting || []),
          ];

          return batting.some((entry) => {
            const entryName = typeof entry?.name === 'string' ? normalizeName(entry.name) : '';
            return entryName === target;
          });
        })
        .map((match: any) => ({
          id: match?.id ?? `${match?.matchName ?? 'match'}-${match?.date ?? ''}`,
          matchName: match?.matchName || 'Match',
          date: match?.date || 'TBD',
          venue: match?.venue || 'TBD',
          status: match?.status || 'COMPLETED',
          result: match?.result || '',
        }));

      setRegisteredMatches(myMatches);
      setActiveModal('registeredMatches');
    } catch (error) {
      console.error('Error fetching match data:', error);
      alert('Failed to load your matches. Please try again.');
    }
  };

  const handleRegisterForMatch = () => {
    setActiveModal('registerMatch');
    // Use upcoming matches from home page data
    const availableMatches = UPCOMING_MATCHES.map(match => ({
      id: match.id,
      date: match.date,
      opponent: match.opponent,
      venue: match.venue,
      deadline: new Date(match.matchDate.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU') // 3 days before match
    }));
    setAvailableMatches(availableMatches);
  };

  const jerseyTotal = merchForm.jerseyQuantity * 25;
  const trouserTotal = merchForm.trouserQuantity * 30;
  const hatTotal = merchForm.hatsQuantity * 14;
  const orderTotal = jerseyTotal + trouserTotal + hatTotal;

  const summaryLabel = emailStatsRecord?.summary?.seasonLabel || "Current Season";
  const summaryMatches = Number(emailStatsRecord?.summary?.matchesPlayed ?? 0);
  const summaryRuns = Number(emailStatsRecord?.summary?.runsScored ?? 0);
  const summaryBattingAverage =
    typeof emailStatsRecord?.summary?.battingAverage === "number"
      ? emailStatsRecord.summary.battingAverage.toFixed(2)
      : "—";
  const summaryHighScore = Number(emailStatsRecord?.summary?.highScore ?? 0);
  const summaryWickets = Number(emailStatsRecord?.summary?.wickets ?? 0);
  const summaryBowlingAverage =
    typeof emailStatsRecord?.summary?.bowlingAverage === "number"
      ? emailStatsRecord.summary.bowlingAverage.toFixed(2)
      : "—";
  const summaryBestBowling = emailStatsRecord?.summary?.bestBowling || "—";
  const summaryCatches = Number(emailStatsRecord?.summary?.totalCatches ?? 0);

  const handleMerchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMerchError(null);
    setMerchMessage(null);
    setMerchUniqueId(null);

    if (!merchForm.email.trim() || !merchForm.phone.trim()) {
      setMerchError("Email and phone number are required.");
      return;
    }

    if (merchForm.jerseyQuantity <= 0 && merchForm.trouserQuantity <= 0 && merchForm.hatsQuantity <= 0) {
      setMerchError("Please select at least one item to order.");
      return;
    }

    if (merchForm.jerseyQuantity > 0 && !merchForm.jerseySize) {
      setMerchError("Please select a jersey size.");
      return;
    }

    if (merchForm.trouserQuantity > 0 && !merchForm.trouserSize) {
      setMerchError("Please select a trouser size.");
      return;
    }

    setMerchSubmitting(true);
    try {
      const response = await fetch("/api/merchandise-preorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...merchForm,
          userUid: user?.id || firebaseUser?.uid || null,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setMerchError(data?.error || "Failed to submit pre-order.");
        return;
      }

      setMerchUniqueId(data?.uniqueId ? String(data.uniqueId) : null);
      setMerchMessage("Your CPSC 2026 Winter pre-order has been submitted.");
      setMerchForm((prev) => ({
        ...prev,
        jerseySize: "",
        jerseyQuantity: 0,
        trouserSize: "",
        trouserQuantity: 0,
        hatsQuantity: 0,
      }));
    } catch (error) {
      console.error("Failed to submit merchandise preorder:", error);
      setMerchError("Failed to submit pre-order.");
    } finally {
      setMerchSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {debugAdmin && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
            <div className="font-bold text-gray-900 mb-2">Admin Debug</div>
            <div>profile user.email: <span className="font-mono">{String(user?.email || "")}</span></div>
            <div>firebaseUser.email: <span className="font-mono">{String(firebaseUser?.email || "")}</span></div>
            <div>providerData.email: <span className="font-mono">{String(providerEmail || "")}</span></div>
            <div>effectiveEmail: <span className="font-mono">{String(effectiveEmail || "")}</span></div>
            <div>emailIsAdmin: <span className="font-mono">{String(emailIsAdmin)}</span></div>
            <div>serverIsAdmin: <span className="font-mono">{String(serverIsAdmin)}</span></div>
            <div>isAdmin: <span className="font-mono">{String(isAdmin)}</span></div>
            <div className="mt-2">
              whoami.uid: <span className="font-mono">{String(serverWhoami?.uid || "")}</span>
            </div>
            <div>
              whoami.email: <span className="font-mono">{String(serverWhoami?.email || "")}</span>
            </div>
            <div>
              whoami.authenticated: <span className="font-mono">{String(serverWhoami?.authenticated ?? "")}</span>
            </div>
            {serverWhoami?.error && (
              <div>
                whoami.error: <span className="font-mono">{String(serverWhoami?.error || "")}</span>
              </div>
            )}
          </div>
        )}
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--color-dark)] mb-2">
              Welcome, {displayName}! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              Manage your profile and cricket activities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-[var(--color-primary)] object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] rounded-full flex items-center justify-center text-white text-xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fileInput = (e.target as HTMLFormElement).elements.namedItem('profilePhoto') as HTMLInputElement;
                if (!fileInput?.files?.[0] || !user?.id) return;
                const file = fileInput.files[0];
                try {
                  // Upload to Firebase Storage
                  const storageRef = ref(storage, `profile-photos/${user.id}/${file.name}`);
                  await uploadBytes(storageRef, file);
                  const photoURL = await getDownloadURL(storageRef);
                  // Update Firestore with new photoURL
                  const res = await fetch('/api/auth/update-photo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid: user.id, photoURL }),
                  });
                  if (res.ok) {
                    window.location.reload();
                  } else {
                    alert('Failed to update profile photo');
                  }
                } catch (err) {
                  alert('Image upload failed.');
                  console.error(err);
                }
              }}
              className="ml-2"
            >
              <input type="file" name="profilePhoto" accept="image/*" className="hidden" id="profilePhotoInput" onChange={e => e.currentTarget.form?.requestSubmit()} />
              <label htmlFor="profilePhotoInput" className="cursor-pointer px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300">Update</label>
            </form>
          </div>
        </div>

        {/* User Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-[var(--color-dark)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] rounded-full flex items-center justify-center text-white text-xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Account Name</p>
                <p className="text-lg font-bold text-[var(--color-dark)]">
                  {displayName}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                ✉️
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-bold text-[var(--color-dark)] truncate">
                  {displayEmail || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl">
                ✓
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Admin Section */}
          {isAdmin && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2">
              <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">Admin</h2>
              <div className="space-y-3">
                <Link
                  href="/admin/matches"
                  className="block w-full px-4 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg font-bold hover:bg-blue-50 transition-colors text-center"
                >
                  Manage Matches
                </Link>
                <Link
                  href="/admin/player-stats"
                  className="block w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors text-center"
                >
                  Manage Player Stats
                </Link>
                <Link
                  href="/admin/standings"
                  className="block w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors text-center"
                >
                  Manage Standings
                </Link>
                <Link
                  href="/admin/register-interest"
                  className="block w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors text-center"
                >
                  Registration Interests
                </Link>
                <Link
                  href="/admin/newsletter-subscribers"
                  className="block w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors text-center"
                >
                  Newsletter Subscribers
                </Link>
              </div>
            </div>
          )}

          {/* Player Stats */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 md:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-3">
              📊 Performance Snapshot
            </div>
            <h2 className="text-2xl font-extrabold text-[var(--color-dark)] mb-2 tracking-tight">My Player Stats</h2>
            <p className="text-sm text-gray-600 mb-6">
              Stats are calculated from PlayHQ scorecards stored in match data.
            </p>

            {myStatsLoading ? (
              <div className="text-gray-600">Loading stats…</div>
            ) : myBattingStats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
                  <p className="text-xs text-gray-600">Matches</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">{myBattingStats.matches}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 shadow-sm">
                  <p className="text-xs text-gray-600">Innings</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">{myBattingStats.innings}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border border-emerald-200 shadow-sm">
                  <p className="text-xs text-gray-600">Runs</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">{myBattingStats.runs}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-lime-50 to-lime-100 border border-lime-200 shadow-sm">
                  <p className="text-xs text-gray-600">Highest</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">{myBattingStats.highest}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-sm">
                  <p className="text-xs text-gray-600">Strike Rate</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">
                    {myBattingStats.balls > 0
                      ? ((myBattingStats.runs / myBattingStats.balls) * 100).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
                  <p className="text-xs text-gray-600">4s / 6s</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">
                    {myBattingStats.fours} / {myBattingStats.sixes}
                  </p>
                </div>
              </div>
            ) : emailStatsRecord?.stats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
                  <p className="text-xs text-gray-600">Matches</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">
                    {Number(emailStatsRecord.stats.matchesPlayed ?? 0)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border border-emerald-200 shadow-sm">
                  <p className="text-xs text-gray-600">Runs</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">
                    {Number(emailStatsRecord.stats.runsScored ?? 0)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-sm">
                  <p className="text-xs text-gray-600">Wickets</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">
                    {Number(emailStatsRecord.stats.wickets ?? 0)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-sm">
                  <p className="text-xs text-gray-600">Batting Avg</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">
                    {typeof emailStatsRecord.stats.battingAverage === "number"
                      ? emailStatsRecord.stats.battingAverage.toFixed(2)
                      : "—"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                No batting entries were found in local match scorecards for your name yet.
                <div className="mt-1 text-amber-800">
                  We will show live PlayCricket stats here once your profile is linked.
                </div>
              </div>
            )}

            {emailStatsRecord?.playCricketUrl && (
              <a
                href={emailStatsRecord.playCricketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
              >
                🔗 View PlayCricket Profile
              </a>
            )}

            {emailStatsRecord?.stats && (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50 text-gray-800 shadow-sm">
                  <p className="text-sm font-semibold text-[var(--color-dark)]">All Seasons - All Clubs, All formats</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-bold text-[var(--color-dark)]">{Number(emailStatsRecord.stats.matchesPlayed ?? 0)}</span> Matches
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveStatsTab("batting")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      activeStatsTab === "batting"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    Batting
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStatsTab("bowling")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      activeStatsTab === "bowling"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    }`}
                  >
                    Bowling
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStatsTab("fielding")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      activeStatsTab === "fielding"
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-purple-700 border-purple-200 hover:bg-purple-50"
                    }`}
                  >
                    Fielding
                  </button>
                </div>

                {activeStatsTab === "batting" && (
                  <div className="rounded-2xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 text-gray-800 shadow-sm animate-[fadeIn_0.2s_ease-in-out]">
                    <h3 className="text-sm font-bold text-[var(--color-dark)] mb-3">Batting</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <p>Innings: <span className="font-bold">{Number(emailStatsRecord.stats.innings ?? 0)}</span></p>
                      <p>Runs: <span className="font-bold">{Number(emailStatsRecord.stats.runsScored ?? 0)}</span></p>
                      <p>Average: <span className="font-bold">{typeof emailStatsRecord.stats.battingAverage === "number" ? emailStatsRecord.stats.battingAverage.toFixed(2) : "—"}</span></p>
                      <p>High Score: <span className="font-bold">{Number(emailStatsRecord.stats.highScore ?? 0)}</span></p>
                      <p>100s: <span className="font-bold">{Number(emailStatsRecord.stats.hundreds ?? 0)}</span></p>
                      <p>50s: <span className="font-bold">{Number(emailStatsRecord.stats.fifties ?? 0)}</span></p>
                      <p>Ducks: <span className="font-bold">{Number(emailStatsRecord.stats.ducks ?? 0)}</span></p>
                      <p>Not Outs: <span className="font-bold">{Number(emailStatsRecord.stats.notOuts ?? 0)}</span></p>
                      <p>Strike Rate: <span className="font-bold">{typeof emailStatsRecord.stats.strikeRate === "number" ? emailStatsRecord.stats.strikeRate.toFixed(1) : "—"}</span></p>
                    </div>
                  </div>
                )}

                {activeStatsTab === "bowling" && (
                  <div className="rounded-2xl border border-green-200 p-4 bg-gradient-to-br from-green-50 to-emerald-50 text-gray-800 shadow-sm animate-[fadeIn_0.2s_ease-in-out]">
                    <h3 className="text-sm font-bold text-[var(--color-dark)] mb-3">Bowling</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <p>Overs: <span className="font-bold">{typeof emailStatsRecord.stats.overs === "number" ? emailStatsRecord.stats.overs.toFixed(1) : "—"}</span></p>
                      <p>Maidens: <span className="font-bold">{Number(emailStatsRecord.stats.maidens ?? 0)}</span></p>
                      <p>Runs: <span className="font-bold">{Number(emailStatsRecord.stats.bowlingRuns ?? 0)}</span></p>
                      <p>Wickets: <span className="font-bold">{Number(emailStatsRecord.stats.wickets ?? 0)}</span></p>
                      <p>Best Bowling: <span className="font-bold">{emailStatsRecord.stats.bestBowling || "—"}</span></p>
                      <p>Average: <span className="font-bold">{typeof emailStatsRecord.stats.bowlingAverage === "number" ? emailStatsRecord.stats.bowlingAverage.toFixed(2) : "—"}</span></p>
                      <p>Economy: <span className="font-bold">{typeof emailStatsRecord.stats.economy === "number" ? emailStatsRecord.stats.economy.toFixed(1) : "—"}</span></p>
                    </div>
                  </div>
                )}

                {activeStatsTab === "fielding" && (
                  <div className="rounded-2xl border border-purple-200 p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 text-gray-800 shadow-sm animate-[fadeIn_0.2s_ease-in-out]">
                    <h3 className="text-sm font-bold text-[var(--color-dark)] mb-3">Fielding</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <p>Total Catches: <span className="font-bold">{Number(emailStatsRecord.stats.totalCatches ?? 0)}</span></p>
                      <p>Wicket Keeper Catches: <span className="font-bold">{Number(emailStatsRecord.stats.wicketKeeperCatches ?? 0)}</span></p>
                      <p>Non Wicket Keeper Catches: <span className="font-bold">{Number(emailStatsRecord.stats.nonWicketKeeperCatches ?? 0)}</span></p>
                      <p>Run Outs: <span className="font-bold">{Number(emailStatsRecord.stats.runOuts ?? 0)}</span></p>
                      <p>Stumpings: <span className="font-bold">{Number(emailStatsRecord.stats.stumpings ?? 0)}</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">
              Profile Settings
            </h2>
            <div className="space-y-4">
              <button 
                onClick={handleEditProfile}
                className="w-full px-4 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                Edit Profile
              </button>
              <button 
                onClick={handleChangePassword}
                className="w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors"
              >
                Change Password
              </button>
              <button className="w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors">
                Privacy Settings
              </button>
            </div>
          </div>

          {/* Matches Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">
              My Matches
            </h2>
            <div className="space-y-4">
              <button 
                onClick={handleViewRegisteredMatches}
                disabled
                className="w-full px-4 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View Registered Matches
              </button>
              <button 
                onClick={handleViewMatchHistory}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View Match History
              </button>
              <button 
                onClick={handleRegisterForMatch}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Register for Match
              </button>
            </div>
          </div>

          {/* Merchandise Pre-Order */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 md:col-span-2 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-2">CPSC 2026 Winter Pre-Order Form</h2>
            <p className="text-sm text-gray-600 mb-6">Order your official merchandise after login.</p>

            <form onSubmit={handleMerchSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={merchForm.email}
                    onChange={(e) => setMerchForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[var(--color-dark)] placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={merchForm.phone}
                    onChange={(e) => setMerchForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[var(--color-dark)] placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="(042) 269-6569"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Player Registration</label>
                  <select
                    value={merchForm.playerRegistration}
                    onChange={(e) => setMerchForm((prev) => ({ ...prev, playerRegistration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[var(--color-dark)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  >
                    <option value="New Player">New Player</option>
                    <option value="Existing Player">Existing Player</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-200 p-4 bg-blue-50">
                  <p className="font-bold text-[var(--color-dark)] mb-3">Half Sleeves Playing Jersey - $25</p>
                  <div className="space-y-3">
                    <select
                      value={merchForm.jerseySize}
                      onChange={(e) => setMerchForm((prev) => ({ ...prev, jerseySize: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[var(--color-dark)]"
                    >
                      <option value="">Select size</option>
                      {MERCH_SIZES.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={0}
                      value={merchForm.jerseyQuantity}
                      onChange={(e) =>
                        setMerchForm((prev) => ({
                          ...prev,
                          jerseyQuantity: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[var(--color-dark)] placeholder:text-gray-500"
                      placeholder="Quantity"
                    />
                    <p className="text-sm text-gray-700">Total Jerseys: <span className="font-bold">{merchForm.jerseyQuantity}</span></p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-4 bg-green-50">
                  <p className="font-bold text-[var(--color-dark)] mb-3">Trouser - $30</p>
                  <div className="space-y-3">
                    <select
                      value={merchForm.trouserSize}
                      onChange={(e) => setMerchForm((prev) => ({ ...prev, trouserSize: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[var(--color-dark)]"
                    >
                      <option value="">Select size</option>
                      {MERCH_SIZES.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={0}
                      value={merchForm.trouserQuantity}
                      onChange={(e) =>
                        setMerchForm((prev) => ({
                          ...prev,
                          trouserQuantity: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[var(--color-dark)] placeholder:text-gray-500"
                      placeholder="Quantity"
                    />
                    <p className="text-sm text-gray-700">Total Trousers: <span className="font-bold">{merchForm.trouserQuantity}</span></p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-4 bg-amber-50">
                  <p className="font-bold text-[var(--color-dark)] mb-3">Hats - $14</p>
                  <input
                    type="number"
                    min={0}
                    value={merchForm.hatsQuantity}
                    onChange={(e) =>
                      setMerchForm((prev) => ({
                        ...prev,
                        hatsQuantity: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[var(--color-dark)] placeholder:text-gray-500"
                    placeholder="Quantity"
                  />
                  <p className="text-sm text-gray-700 mt-3">Total Hats: <span className="font-bold">{merchForm.hatsQuantity}</span></p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                <p className="text-sm text-gray-700">Jersey Total: <span className="font-bold">${jerseyTotal}</span></p>
                <p className="text-sm text-gray-700">Trouser Total: <span className="font-bold">${trouserTotal}</span></p>
                <p className="text-sm text-gray-700">Hats Total: <span className="font-bold">${hatTotal}</span></p>
                <p className="text-lg font-bold text-[var(--color-dark)] mt-1">Order Total: ${orderTotal}</p>
                {merchUniqueId && (
                  <p className="text-sm text-[var(--color-primary)] mt-2">Unique ID: <span className="font-bold">{merchUniqueId}</span></p>
                )}
              </div>

              {merchError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{merchError}</div>
              )}
              {merchMessage && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">{merchMessage}</div>
              )}

              <button
                type="submit"
                disabled={merchSubmitting}
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-60"
              >
                {merchSubmitting ? "Submitting..." : "Submit Pre-Order"}
              </button>
            </form>
          </div>

          {/* Summary Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 md:col-span-2 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">
              Summary
            </h2>
            {emailStatsLoading ? (
              <div className="text-gray-600">Loading summary…</div>
            ) : emailStatsRecord?.summary ? (
              <>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-4">
                  {summaryLabel}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-xs text-gray-600">Matches Played</p>
                    <p className="text-2xl font-black text-[var(--color-dark)]">{summaryMatches}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                    <p className="text-xs text-gray-600">Runs</p>
                    <p className="text-2xl font-black text-[var(--color-dark)]">{summaryRuns}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p className="text-xs text-gray-600">Batting Average</p>
                    <p className="text-2xl font-black text-[var(--color-dark)]">{summaryBattingAverage}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-lime-50 border border-lime-100">
                    <p className="text-xs text-gray-600">High Score</p>
                    <p className="text-2xl font-black text-[var(--color-dark)]">{summaryHighScore}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                    <p className="text-xs text-gray-600">Wickets</p>
                    <p className="text-2xl font-black text-[var(--color-dark)]">{summaryWickets}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-fuchsia-50 border border-fuchsia-100">
                    <p className="text-xs text-gray-600">Bowling Average</p>
                    <p className="text-2xl font-black text-[var(--color-dark)]">{summaryBowlingAverage}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-xs text-gray-600">Best Bowling</p>
                    <p className="text-2xl font-black text-[var(--color-dark)]">{summaryBestBowling}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs text-gray-600">Total Catches</p>
                    <p className="text-2xl font-black text-[var(--color-dark)]">{summaryCatches}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                No summary data available yet. Link your PlayCricket profile to fetch summary stats.
              </div>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-[var(--color-dark)] rounded-lg font-bold hover:shadow-lg transition-shadow border-2 border-[var(--color-primary)]"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'editProfile' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-6">Edit Profile</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
            </form>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle profile update
                  alert('Profile updated successfully!');
                  setActiveModal(null);
                }}
                className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'changePassword' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-6">Change Password</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={profileData.newPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
            </form>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (profileData.newPassword !== profileData.confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                  }
                  // Handle password change
                  alert('Password changed successfully!');
                  setActiveModal(null);
                }}
                className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'matchHistory' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-6">Match History</h3>
            <div className="space-y-4">
              {matchHistory.map((match) => (
                <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">vs {match.opponent}</p>
                      <p className="text-gray-600">{match.date}</p>
                      <p className="text-sm text-gray-500">Score: {match.score}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {match.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'registeredMatches' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-2">My Matches</h3>
            <p className="text-sm text-gray-600 mb-6">Based on PlayHQ match data available to the site.</p>
            <div className="space-y-4">
              {registeredMatches.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  No matches found for <span className="font-bold">{user?.name}</span> in the current match data.
                  <div className="mt-1 text-sm text-amber-800">
                    Matches will appear once scorecards are added to match data.
                  </div>
                </div>
              ) : (
                registeredMatches.map((match: any) => (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-bold text-lg">{match.matchName}</p>
                        <p className="text-gray-600">{match.date}</p>
                        <p className="text-sm text-gray-500">Venue: {match.venue}</p>
                        {match.result ? (
                          <p className="text-sm text-gray-600 mt-1">Result: {match.result}</p>
                        ) : null}
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium whitespace-nowrap">
                        {match.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'registerMatch' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-6">Register for Match</h3>
            <div className="space-y-4">
              {availableMatches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg">vs {match.opponent}</p>
                          <p className="text-gray-600">{match.date}</p>
                          <p className="text-sm text-gray-500">Venue: {match.venue}</p>
                          <p className="text-sm text-orange-600">Registration Deadline: {match.deadline}</p>
                        </div>
                        <button
                          onClick={async () => {
                            console.log('Registering for match:', match);
                            console.log('User data:', { email: user?.email, name: user?.name });

                            if (!user?.email || !user?.name) {
                              alert('User information is missing. Please try logging out and logging back in.');
                              return;
                            }

                            try {
                              const response = await fetch('/api/match-registration', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  matchId: match.id,
                                  matchDetails: {
                                    opponent: match.opponent,
                                    date: match.date,
                                    venue: match.venue,
                                    deadline: match.deadline
                                  },
                                  userEmail: user.email,
                                  userName: user.name
                                }),
                              });

                              const result = await response.json();

                              if (response.ok) {
                                alert(`Successfully registered for match vs ${match.opponent.split(' vs ')[1]}!`);
                                setActiveModal(null);
                              } else {
                                alert(`Registration failed: ${result.error}`);
                              }
                            } catch (error) {
                              console.error('Registration error:', error);
                              alert('Failed to register for match. Please try again.');
                            }
                          }}
                          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                        >
                          {(() => {
                            // Remove first 'vs' if present
                            let label = match.opponent;
                            if (label.startsWith('CPSC vs ')) {
                              label = label.replace('CPSC vs ', '');
                            } else if (label.startsWith('vs ')) {
                              label = label.replace('vs ', '');
                            }
                            return `Register for match: CPSC vs ${label}`;
                          })()}
                        </button>
                      </div>
                    </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
