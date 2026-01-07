"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { storage } from "@/app/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { logAnalyticsEvent } from "@/app/lib/analytics";
import { UPCOMING_MATCHES } from "../data/upcoming-matches";

export default function DashboardPage() {
  const { user, firebaseUser, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const ADMIN_EMAIL = "crsvp.2023@gmail.com";
  const effectiveEmail = (user?.email || firebaseUser?.email || "").trim().toLowerCase();
  const emailIsAdmin = effectiveEmail === ADMIN_EMAIL.trim().toLowerCase();
  const [serverIsAdmin, setServerIsAdmin] = useState<boolean | null>(null);
  const isAdmin = serverIsAdmin === true || (serverIsAdmin === null && emailIsAdmin);
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

  const [emailStatsLoading, setEmailStatsLoading] = useState(false);
  const [emailStatsRecord, setEmailStatsRecord] = useState<null | {
    playCricketUrl?: string;
    stats?: {
      matchesPlayed?: number;
      runsScored?: number;
      wickets?: number;
      battingAverage?: number;
      strikeRate?: number;
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
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

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
        setServerIsAdmin(!!data?.isAdmin);
      } catch {
        if (cancelled) return;
        setServerIsAdmin(null);
      }
    };

    checkAdmin();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, firebaseUser]);

  useEffect(() => {
    const normalizeName = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

    const loadMyPlayerStats = async () => {
      if (!isAuthenticated || !user?.name) return;

      setMyStatsLoading(true);

      try {
        const response = await fetch("/matches-data.json", { cache: "no-store" });
        if (!response.ok) {
          setMyBattingStats(null);
          return;
        }

        const data = await response.json();
        const matches = Array.isArray(data?.matches) ? data.matches : [];
        const target = normalizeName(user.name);

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
  }, [isAuthenticated, user?.name]);

  useEffect(() => {
    const loadEmailStats = async () => {
      if (!isAuthenticated || !user?.email) {
        setEmailStatsRecord(null);
        return;
      }

      setEmailStatsLoading(true);
      try {
        const email = user.email.trim().toLowerCase();
        const res = await fetch(`/api/player-stats?email=${encodeURIComponent(email)}`, { cache: "no-store" });
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
  }, [isAuthenticated, user?.email]);

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

    if (!user?.name) {
      alert('User name is missing. Please log out and log back in.');
      return;
    }

    try {
      // We don’t have PlayHQ SSO in this app; instead we use PlayHQ-derived match data
      // and match the logged-in user's name against stored scorecards.
      const response = await fetch('/matches-data.json', { cache: 'no-store' });
      if (!response.ok) {
        alert('Could not load match data. Please try again.');
        return;
      }

      const data = await response.json();
      const matches = Array.isArray(data?.matches) ? data.matches : [];
      const target = normalizeName(user.name);

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--color-dark)] mb-2">
              Welcome, {user?.name}! 🎉
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
                {user?.name?.charAt(0).toUpperCase()}
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
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Account Name</p>
                <p className="text-lg font-bold text-[var(--color-dark)]">
                  {user?.name}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                ✉️
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-bold text-[var(--color-dark)] truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Section */}
          {isAdmin && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
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
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-2">My Player Stats</h2>
            <p className="text-sm text-gray-600 mb-6">
              Stats are calculated from PlayHQ scorecards stored in match data.
            </p>

            {myStatsLoading ? (
              <div className="text-gray-600">Loading stats…</div>
            ) : myBattingStats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs text-gray-600">Matches</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">{myBattingStats.matches}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs text-gray-600">Innings</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">{myBattingStats.innings}</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <p className="text-xs text-gray-600">Runs</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">{myBattingStats.runs}</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <p className="text-xs text-gray-600">Highest</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">{myBattingStats.highest}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="text-xs text-gray-600">Strike Rate</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">
                    {myBattingStats.balls > 0
                      ? ((myBattingStats.runs / myBattingStats.balls) * 100).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="text-xs text-gray-600">4s / 6s</p>
                  <p className="text-2xl font-black text-[var(--color-dark)]">
                    {myBattingStats.fours} / {myBattingStats.sixes}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
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
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">
              My Matches
            </h2>
            <div className="space-y-4">
              <button 
                onClick={handleViewRegisteredMatches}
                className="w-full px-4 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                View Registered Matches
              </button>
              <button 
                onClick={handleViewMatchHistory}
                className="w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors"
              >
                View Match History
              </button>
              <button 
                onClick={handleRegisterForMatch}
                className="w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors"
              >
                Register for Match
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">
              Statistics
            </h2>

            {emailStatsLoading ? (
              <div className="text-gray-600">Loading…</div>
            ) : emailStatsRecord?.stats ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-[var(--color-primary)]">
                      {Number(emailStatsRecord.stats.matchesPlayed ?? 0)}
                    </p>
                    <p className="text-sm text-gray-600">Matches Played</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {Number(emailStatsRecord.stats.runsScored ?? 0)}
                    </p>
                    <p className="text-sm text-gray-600">Runs Scored</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-purple-700">
                      {Number(emailStatsRecord.stats.wickets ?? 0)}
                    </p>
                    <p className="text-sm text-gray-600">Wickets</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-[var(--color-dark)]">
                      {typeof emailStatsRecord.stats.battingAverage === "number"
                        ? emailStatsRecord.stats.battingAverage.toFixed(2)
                        : "—"}
                    </p>
                    <p className="text-sm text-gray-600">Batting Avg</p>
                  </div>
                </div>

                {emailStatsRecord.playCricketUrl && (
                  <a
                    href={emailStatsRecord.playCricketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    View PlayCricket Profile →
                  </a>
                )}
              </>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                No stats record found for <span className="font-bold">{user?.email}</span>.
                <div className="mt-1 text-sm text-amber-800">
                  Add a Firestore doc in <span className="font-semibold">playerStats</span> with doc id = your email.
                </div>
              </div>
            )}
          </div>

          {/* Activity Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">
              Analytics
            </h2>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">View detailed website analytics and user engagement metrics</p>
              <Link
                href="/analytics"
                className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-[var(--color-dark)] rounded-lg font-bold hover:shadow-lg transition-shadow border-2 border-[var(--color-primary)]"
              >
                📊 View Analytics
              </Link>
            </div>
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
