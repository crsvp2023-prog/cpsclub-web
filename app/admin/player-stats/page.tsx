'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useServerAdmin } from '@/app/lib/useServerAdmin';

type PlayerStats = {
  matchesPlayed?: number;
  runsScored?: number;
  wickets?: number;
  battingAverage?: number;
  strikeRate?: number;
};

type PlayerStatsRecord = {
  email?: string;
  playCricketUrl?: string;
  stats?: PlayerStats;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : undefined;
}

export default function AdminPlayerStatsPage() {
  const router = useRouter();
  const { user, firebaseUser, isAuthenticated, isLoading: authLoading } = useAuth();

  const { serverIsAdmin, checking: adminChecking } = useServerAdmin(isAuthenticated, firebaseUser);
  const isAdmin = serverIsAdmin === true;

  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [playCricketUrl, setPlayCricketUrl] = useState('');
  const [matchesPlayed, setMatchesPlayed] = useState('');
  const [runsScored, setRunsScored] = useState('');
  const [wickets, setWickets] = useState('');
  const [battingAverage, setBattingAverage] = useState('');
  const [strikeRate, setStrikeRate] = useState('');

  const normalizedEmail = useMemo(() => normalizeEmail(emailInput), [emailInput]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || adminChecking || (isAuthenticated && serverIsAdmin === null)) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[var(--color-dark)] via-blue-50 to-green-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </main>
    );
  }

  const loadRecord = async () => {
    if (!normalizedEmail) {
      setMessage('Enter an email to load.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (!firebaseUser) {
        setMessage('Not authenticated. Please log out and log in again.');
        return;
      }

      const idToken = await firebaseUser.getIdToken();
      const res = await fetch(`/api/admin/player-stats?email=${encodeURIComponent(normalizedEmail)}`, {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setMessage(text ? `Failed to load record. ${text}` : 'Failed to load record.');
        return;
      }

      const data = await res.json();

      if (!data?.exists) {
        setPlayCricketUrl('');
        setMatchesPlayed('');
        setRunsScored('');
        setWickets('');
        setBattingAverage('');
        setStrikeRate('');
        setMessage('No record found. Fill values and click Save to create one.');
        return;
      }

      setPlayCricketUrl(typeof data.playCricketUrl === 'string' ? data.playCricketUrl : '');

      const stats = data.stats || {};
      setMatchesPlayed(stats.matchesPlayed != null ? String(stats.matchesPlayed) : '');
      setRunsScored(stats.runsScored != null ? String(stats.runsScored) : '');
      setWickets(stats.wickets != null ? String(stats.wickets) : '');
      setBattingAverage(stats.battingAverage != null ? String(stats.battingAverage) : '');
      setStrikeRate(stats.strikeRate != null ? String(stats.strikeRate) : '');

      setMessage('Record loaded.');
    } catch (e) {
      console.error('Failed to load player stats record:', e);
      setMessage('Failed to load record.');
    } finally {
      setLoading(false);
    }
  };

  const saveRecord = async () => {
    if (!normalizedEmail) {
      setMessage('Enter an email to save.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const payload: PlayerStatsRecord = {
        email: normalizedEmail,
        playCricketUrl: playCricketUrl.trim() || undefined,
        stats: {
          matchesPlayed: toOptionalNumber(matchesPlayed),
          runsScored: toOptionalNumber(runsScored),
          wickets: toOptionalNumber(wickets),
          battingAverage: toOptionalNumber(battingAverage),
          strikeRate: toOptionalNumber(strikeRate),
        },
      };

      if (!firebaseUser) {
        setMessage('Not authenticated. Please log out and log in again.');
        return;
      }

      const idToken = await firebaseUser.getIdToken();
      const res = await fetch('/api/admin/player-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setMessage(text ? `Failed to save record. ${text}` : 'Failed to save record.');
        return;
      }

      const data = await res.json().catch(() => null);
      if (data?.projectId && data?.docId) {
        setMessage(`Saved. (project: ${String(data.projectId)}, doc: ${String(data.docId)})`);
      } else {
        setMessage('Saved.');
      }
    } catch (e) {
      console.error('Failed to save player stats record:', e);
      setMessage('Failed to save record.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[var(--color-dark)] via-blue-50 to-green-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[var(--color-dark)] via-blue-50 to-green-50 pt-20 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page. Admin access required.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:shadow-lg transition-all"
          >
            Go Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full border border-blue-300">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider">Admin Dashboard</p>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Player Stats</h1>
          <p className="text-gray-600">Create or update stats records linked to a player email.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Player Email (doc id)</label>
              <input
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="player@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Saved as doc id: {normalizedEmail || '—'}</p>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={loadRecord}
                disabled={loading}
                className="flex-1 px-4 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg font-bold hover:bg-blue-50 transition-colors disabled:opacity-60"
              >
                Load
              </button>
              <button
                onClick={saveRecord}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>

          {message && (
            <div className="mb-6 p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700">{message}</div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PlayCricket URL (optional)</label>
              <input
                value={playCricketUrl}
                onChange={(e) => setPlayCricketUrl(e.target.value)}
                placeholder="https://play.cricket.com.au/player/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matches Played</label>
                <input
                  value={matchesPlayed}
                  onChange={(e) => setMatchesPlayed(e.target.value)}
                  inputMode="numeric"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Runs Scored</label>
                <input
                  value={runsScored}
                  onChange={(e) => setRunsScored(e.target.value)}
                  inputMode="numeric"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wickets</label>
                <input
                  value={wickets}
                  onChange={(e) => setWickets(e.target.value)}
                  inputMode="numeric"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batting Average</label>
                <input
                  value={battingAverage}
                  onChange={(e) => setBattingAverage(e.target.value)}
                  inputMode="decimal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Strike Rate</label>
                <input
                  value={strikeRate}
                  onChange={(e) => setStrikeRate(e.target.value)}
                  inputMode="decimal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
