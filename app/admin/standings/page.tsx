'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useServerAdmin } from '@/app/lib/useServerAdmin';

interface Standing {
  position: number;
  team: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
  nrr: string;
}

export default function StandingsAdmin() {
  const { isAuthenticated, firebaseUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { serverIsAdmin, checking: adminChecking } = useServerAdmin(isAuthenticated, firebaseUser);
  const isAdmin = serverIsAdmin === true;
  
  const [standings, setStandings] = useState<Standing[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication and redirect if not admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      if (!isAdmin) {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

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

  // Load current standings on component mount
  useEffect(() => {
    loadCurrentStandings();
  }, []);

  const loadCurrentStandings = async () => {
    try {
      setIsLoading(true);
      // Load standings directly from the cached JSON file
      const response = await fetch('/playhq-data.json');
      if (response.ok) {
        const data = await response.json();
        if (data.standings) {
          setStandings(data.standings);
          setMessage('✅ Data loaded from cache');
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
      console.error('Failed to load current standings:', error);
      setMessage('⚠️ Could not load current data, using defaults');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStanding = (index: number, field: keyof Standing, value: string | number) => {
    const newStandings = [...standings];
    newStandings[index] = { ...newStandings[index], [field]: value };
    setStandings(newStandings);
  };

  const addTeam = () => {
    setStandings([...standings, {
      position: standings.length + 1,
      team: "",
      played: 0,
      wins: 0,
      losses: 0,
      points: 0,
      nrr: "0.00"
    }]);
  };

  const removeTeam = (index: number) => {
    setStandings(standings.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsUpdating(true);
    setMessage('');

    try {
      const response = await fetch('/api/update-standings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: 'C One Day Grade',
          standings: standings,
          source: 'Admin Manual Update'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Standings updated successfully!');
        // Reload data to confirm the update
        setTimeout(async () => {
          try {
            const refreshResponse = await fetch('/playhq-data.json');
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.standings) {
                setStandings(refreshData.standings);
              }
            }
          } catch (error) {
            console.error('Failed to refresh data after update:', error);
          }
        }, 1000);
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to update'}`);
      }
    } catch (error) {
      setMessage('❌ Error: Could not update standings');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--color-dark)] via-blue-50 to-green-50 pt-20">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--color-dark)] mb-2">
            ⚙️ Admin: Update Standings
          </h1>
          <p className="text-lg text-gray-600">
            Manually update cricket standings from PlayHQ data
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Current Standings</h2>
              <button
                onClick={loadCurrentStandings}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold text-sm disabled:opacity-50"
              >
                🔄 Refresh Data
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Copy the latest data from PlayHQ and update the fields below.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
              <p className="mt-4 text-gray-600">Loading current standings...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Pos</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Team</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">P</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">W</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">L</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Pts</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">NRR</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((standing, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={standing.position}
                          onChange={(e) => updateStanding(index, 'position', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border rounded text-center"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={standing.team}
                          onChange={(e) => updateStanding(index, 'team', e.target.value)}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={standing.played}
                          onChange={(e) => updateStanding(index, 'played', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border rounded text-center"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={standing.wins}
                          onChange={(e) => updateStanding(index, 'wins', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border rounded text-center"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={standing.losses}
                          onChange={(e) => updateStanding(index, 'losses', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border rounded text-center"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={standing.points}
                          onChange={(e) => updateStanding(index, 'points', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border rounded text-center"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={standing.nrr}
                          onChange={(e) => updateStanding(index, 'nrr', e.target.value)}
                          className="w-20 px-2 py-1 border rounded text-center"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeTeam(index)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && (
            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <button
                onClick={addTeam}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
              >
                ➕ Add Team
              </button>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={isUpdating}
                  className={`px-6 py-3 font-black rounded-lg transition-all duration-300 ${
                    isUpdating
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {isUpdating ? '⏳ Updating...' : '💾 Save Changes'}
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className={`mt-4 p-4 rounded-lg text-center font-semibold ${
              message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">📋 How to Update:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Visit the <a href="https://ca.playhq.com/org/829b8e20-e0d3-44a5-90c7-1666ada5c1fe/seasons/7fe749e5-1e03-4a25-9f9a-cfb498fe8608/all-ladders" target="_blank" rel="noopener noreferrer" className="underline">PlayHQ ladders page</a></li>
              <li>2. Find the "C One Day Grade" section</li>
              <li>3. Copy the current standings data into the form above</li>
              <li>4. Click "Save Changes" to update the website</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}