'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useServerAdmin } from '@/app/lib/useServerAdmin';

interface Match {
  id: number;
  matchName: string;
  category: string;
  date: string;
  venue: string;
  status: string;
  result: string;
  team1: {
    name: string;
    score: number;
    wickets: number;
    overs: string;
    batting: any[];
  };
  team2: {
    name: string;
    score: number;
    wickets: number;
    overs: string;
    batting: any[];
  };
}

export default function MatchesAdmin() {
  const { isAuthenticated, firebaseUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { serverIsAdmin, checking: adminChecking } = useServerAdmin(isAuthenticated, firebaseUser);
  const isAdmin = serverIsAdmin === true;

  const [matches, setMatches] = useState<Match[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const loadCurrentMatches = async () => {
    try {
      setIsLoading(true);
      // Load matches from the persisted API (Firestore-backed on Vercel)
      const response = await fetch('/api/update-matches', { cache: 'no-store' });
      if (response.ok) {
        const api = await response.json();
        const data = api?.success ? api.data : null;
        if (data?.matches) {
          setMatches(data.matches);
          setMessage('✅ Data loaded');
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage('⚠️ Could not load current data, using defaults');
          setTimeout(() => setMessage(''), 3000);
        }
      } else {
        setMessage('⚠️ Could not load current data, using defaults');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to load current matches:', error);
      setMessage('⚠️ Could not load current data, using defaults');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication and redirect if not admin
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load current matches once permissions are resolved and the user is admin.
  useEffect(() => {
    if (authLoading || adminChecking) return;
    if (!isAuthenticated || !isAdmin) return;
    loadCurrentMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, adminChecking, isAuthenticated, isAdmin]);

  // Show loading while checking authentication/admin
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

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[var(--color-dark)] via-blue-50 to-green-50 pt-20 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Admin access required.
          </p>
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

  const updateMatch = (index: number, field: string, value: string | number) => {
    const newMatches = [...matches];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newMatches[index] = {
        ...newMatches[index],
        [parent]: {
          ...newMatches[index][parent as keyof Match] as any,
          [child]: value
        }
      };
    } else {
      newMatches[index] = { ...newMatches[index], [field]: value };
    }
    setMatches(newMatches);
  };

  const addMatch = () => {
    setMatches([...matches, {
      id: matches.length + 1,
      matchName: "",
      category: "Northern Cricket Union - Grade C",
      date: "",
      venue: "Chatswood Premier Sports Club",
      status: "UPCOMING",
      result: "",
      team1: {
        name: "",
        score: 0,
        wickets: 0,
        overs: "0.0",
        batting: []
      },
      team2: {
        name: "",
        score: 0,
        wickets: 0,
        overs: "0.0",
        batting: []
      }
    }]);
  };

  const removeMatch = (index: number) => {
    setMatches(matches.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsUpdating(true);
    setMessage('');

    try {
      const response = await fetch('/api/update-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matches: matches,
          source: 'Admin Manual Update'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Matches updated successfully!');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to update matches'}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage('❌ Error: Failed to update matches');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImportCsv = async () => {
    if (!csvFile) {
      setMessage('⚠️ Please choose a CSV file to import');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsImporting(true);
    setMessage('');

    try {
      const form = new FormData();
      form.append('file', csvFile);

      const response = await fetch('/api/update-matches-from-csv', {
        method: 'POST',
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message || 'CSV imported successfully'}`);
        setCsvFile(null);
        await loadCurrentMatches();
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to import CSV'}`);
      }
    } catch (error) {
      console.error('CSV import error:', error);
      setMessage('❌ Error: Failed to import CSV');
    } finally {
      setIsImporting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[var(--color-dark)] via-blue-50 to-green-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
          <p className="mt-4 text-gray-600">Loading current matches...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--color-dark)] via-blue-50 to-green-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-[var(--color-dark)] mb-2">Admin: Update Matches</h1>
                <p className="text-gray-600">Manually update match data since PlayHQ blocks automated access</p>
              </div>
              <button
                onClick={() => router.push('/scores')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ← Back to Scores
              </button>
            </div>

            <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-dark)]">Import from CSV</h2>
                  <p className="text-sm text-gray-600">Upload the PlayHQ fixture export to update the site</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
                    className="block w-full sm:w-80 text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  <button
                    onClick={handleImportCsv}
                    disabled={isImporting || !csvFile}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isImporting ? 'Importing…' : 'Import CSV'}
                  </button>
                </div>
              </div>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : message.includes('❌') ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
                {message}
              </div>
            )}

            <div className="space-y-6">
              {matches.map((match, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--color-dark)]">Match #{match.id}</h3>
                    <button
                      onClick={() => removeMatch(index)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Match Name</label>
                      <input
                        type="text"
                        value={match.matchName}
                        onChange={(e) => updateMatch(index, 'matchName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="e.g., CPS Club vs Hornsby"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="text"
                        value={match.date}
                        onChange={(e) => updateMatch(index, 'date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="e.g., December 20, 2025"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                      <input
                        type="text"
                        value={match.venue}
                        onChange={(e) => updateMatch(index, 'venue', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="e.g., Chatswood Premier Sports Club"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={match.status}
                        onChange={(e) => updateMatch(index, 'status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        <option value="UPCOMING">UPCOMING</option>
                        <option value="LIVE">LIVE</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                      <input
                        type="text"
                        value={match.result}
                        onChange={(e) => updateMatch(index, 'result', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="e.g., CPS Club won by 32 runs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-[var(--color-dark)] mb-3">Team 1</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={match.team1.name}
                            onChange={(e) => updateMatch(index, 'team1.name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                            <input
                              type="number"
                              value={match.team1.score}
                              onChange={(e) => updateMatch(index, 'team1.score', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Wickets</label>
                            <input
                              type="number"
                              value={match.team1.wickets}
                              onChange={(e) => updateMatch(index, 'team1.wickets', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Overs</label>
                            <input
                              type="text"
                              value={match.team1.overs}
                              onChange={(e) => updateMatch(index, 'team1.overs', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-[var(--color-dark)] mb-3">Team 2</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={match.team2.name}
                            onChange={(e) => updateMatch(index, 'team2.name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                            <input
                              type="number"
                              value={match.team2.score}
                              onChange={(e) => updateMatch(index, 'team2.score', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Wickets</label>
                            <input
                              type="number"
                              value={match.team2.wickets}
                              onChange={(e) => updateMatch(index, 'team2.wickets', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Overs</label>
                            <input
                              type="text"
                              value={match.team2.overs}
                              onChange={(e) => updateMatch(index, 'team2.overs', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={addMatch}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                + Add Match
              </button>

              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Matches'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}