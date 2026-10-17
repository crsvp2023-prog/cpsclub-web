'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

// Admin email configuration
const ADMIN_EMAIL = 'crsvp.2023@gmail.com'; // Change this to the actual admin email
// For testing: set to true to allow any authenticated user to see admin link
const ALLOW_ANY_AUTH_USER = false;

interface Standing {
  position: number;
  team: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
  nrr: string;
}

interface BattingPerformance {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
}

interface MatchTeam {
  name: string;
  score: number;
  wickets: number;
  overs: string;
  batting: BattingPerformance[];
}

interface Match {
  id: number;
  matchName: string;
  category: string;
  date: string;
  venue: string;
  status: string;
  result: string;
  commentary?: string;
  highlights?: string[];
  team1: MatchTeam;
  team2: MatchTeam;
}

const PLAYHQ_COMPETITION_URL = process.env.NEXT_PUBLIC_PLAYHQ_COMPETITION_URL;

export default function ScoresPage() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = ALLOW_ANY_AUTH_USER ? isAuthenticated : (isAuthenticated && user?.email === ADMIN_EMAIL);
  
  const [expandedMatch, setExpandedMatch] = useState<number | null>(0);
  const [selectedTab, setSelectedTab] = useState<'team1' | 'team2'>('team1');
  const [standings, setStandings] = useState<Standing[]>([]);
  const [standingsError, setStandingsError] = useState('');
  const [grade, setGrade] = useState<string>('C One Day Grade');
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesError, setMatchesError] = useState('');
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStandings, setIsLoadingStandings] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [scrapeMessage, setScrapeMessage] = useState('');

  const loadMatches = useCallback(async () => {
    setIsLoadingMatches(true);
    try {
      const response = await fetch('/api/update-matches', { cache: 'no-store' });
      if (response.status === 404) {
        setMatches([]);
        setMatchesError('');
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to load match data');
      }

      const storedMatches = data?.data?.matches;
      if (!Array.isArray(storedMatches)) {
        throw new Error('Match data response is invalid');
      }
      setMatches(storedMatches);
      setMatchesError('');
    } catch (error) {
      console.error('Failed to load match data:', error);
      setMatches([]);
      setMatchesError(error instanceof Error ? error.message : 'Unable to load match data');
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  const loadStandings = useCallback(async () => {
    setIsLoadingStandings(true);
    setStandingsError('');

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      let response: Response;
      try {
        response = await fetch('/api/scrape-playhq', {
          cache: 'no-store',
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }
      const apiData = await response.json();
      if (!response.ok || !apiData.success || !Array.isArray(apiData.data?.standings)) {
        throw new Error(apiData.error || apiData.message || 'Current PlayHQ standings are unavailable');
      }

      setStandings(apiData.data.standings);
      setGrade(apiData.data.grade || 'C One Day Grade');
      setLastUpdated(apiData.data.lastUpdated || '');
      return null;
    } catch (error) {
      console.error('Failed to load current PlayHQ standings:', error);
      const message = error instanceof Error ? error.message : 'Current PlayHQ standings are unavailable';
      setStandings([]);
      setLastUpdated('');
      setStandingsError(message);
      return message;
    } finally {
      setIsLoadingStandings(false);
    }
  }, []);

  useEffect(() => {
    void loadStandings();
    void loadMatches();
  }, [loadMatches, loadStandings]);

  const handleScrapePlayHQ = async () => {
    setIsLoading(true);
    setScrapeMessage('');
    const error = await loadStandings();
    setScrapeMessage(error ? `❌ ${error}` : '✅ Current PlayHQ standings refreshed.');
    setIsLoading(false);
    setTimeout(() => setScrapeMessage(''), 5000);
  };



  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--color-dark)] via-blue-50 to-green-50 pt-20">
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }
      `}</style>

      {/* Live Scores Banner */}
      <div className="sticky top-20 z-40 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-primary-2)] to-[var(--color-primary)] px-6 py-4 shadow-xl">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏏</span>
            <div>
              <p className="font-black text-white uppercase tracking-wide">CPS Club Cricket Scores</p>
              <p className="text-white/90 text-sm">Current competition data appears when it is available.</p>
            </div>
          </div>
          {PLAYHQ_COMPETITION_URL && (
            <a
              href={PLAYHQ_COMPETITION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-[var(--color-primary)] font-black rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              VIEW LIVE SCORES 📊
            </a>
          )}
        </div>
      </div>

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 py-12 text-center animate-slideInUp">
        <div className="inline-block px-4 py-2 bg-[var(--color-accent)]/20 rounded-full border-2 border-[var(--color-accent)] mb-4 backdrop-blur-sm">
          <p className="text-sm font-bold text-[var(--color-accent)]">📊 LIVE SCORES</p>
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-lg">
          Match <span className="text-[var(--color-accent)]">Scores</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Live competition standings and match results
        </p>
      </section>

      {/* Standings Section */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-[var(--color-dark)] mb-2">
            🏆 Competition Standings
          </h2>
          <p className="text-lg text-gray-600 font-semibold">{grade}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
          {/* Header with Scrape Button */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-gray-700 font-semibold">
                  📊 {lastUpdated ? `Live PlayHQ data updated ${new Date(lastUpdated).toLocaleString('en-AU')}` : 'Standings are loaded directly from PlayHQ'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {isAdmin && (
                  <>
                    <a
                      href="/admin/standings"
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-semibold text-sm text-center"
                    >
                      ⚙️ Update Standings
                    </a>
                    <a
                      href="/admin/matches"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold text-sm text-center"
                    >
                      ⚙️ Update Matches
                    </a>
                  </>
                )}
                <button
                  onClick={handleScrapePlayHQ}
                  disabled={isLoading}
                  className={`px-6 py-3 font-black rounded-lg whitespace-nowrap transition-all duration-300 ${
                    isLoading
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {isLoading ? '⏳ Refreshing...' : '🔄 Refresh Standings'}
                </button>
              </div>
            </div>
            {scrapeMessage && (
              <p className="text-center mt-4 text-sm font-semibold">{scrapeMessage}</p>
            )}
          </div>

          {/* Standings Table */}
          <div className="overflow-x-auto">
            {isLoadingStandings ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading current standings from PlayHQ...</p>
              </div>
            ) : standingsError ? (
              <div className="p-8 text-center text-amber-900">
                <p className="font-semibold">Current PlayHQ standings are unavailable.</p>
                <p className="mt-2 text-sm">{standingsError}</p>
              </div>
            ) : standings.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No standings have been returned by PlayHQ for this competition.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white">
                    <th className="px-4 py-4 text-left font-black">Position</th>
                    <th className="px-4 py-4 text-left font-black">Team</th>
                    <th className="px-4 py-4 text-center font-black">Played</th>
                    <th className="px-4 py-4 text-center font-black">Wins</th>
                    <th className="px-4 py-4 text-center font-black">Losses</th>
                    <th className="px-4 py-4 text-center font-black">Points</th>
                    <th className="px-4 py-4 text-center font-black">NRR</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-gray-200 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-100 transition-colors`}
                    >
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white font-black text-lg">
                          {team.position === 1 ? '🥇' : team.position === 2 ? '🥈' : team.position === 3 ? '🥉' : team.position}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-800">
                        {team.team === 'CPS Club' ? (
                          <span className="text-[var(--color-primary-2)] font-black">{team.team}</span>
                        ) : (
                          team.team
                        )}
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-gray-700">{team.played}</td>
                      <td className="px-4 py-4 text-center font-semibold text-green-600">{team.wins}</td>
                      <td className="px-4 py-4 text-center font-semibold text-red-600">{team.losses}</td>
                      <td className="px-4 py-4 text-center font-black text-lg text-[var(--color-primary-2)]">{team.points}</td>
                      <td className="px-4 py-4 text-center font-semibold text-gray-700">{team.nrr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        {/* Data Update Notice */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="text-sm text-gray-700">
                <strong>Live data:</strong> Standings are displayed only when returned by the configured PlayHQ competition.
                No saved or sample standings are shown when PlayHQ is unavailable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scores Section */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {/* PlayHQ Info Card */}
        <div className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
          <div className="flex items-start gap-4">
            <span className="text-5xl">📱</span>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-[var(--color-dark)] mb-2">Complete Scores on PlayHQ</h3>
              <p className="text-gray-700 mb-4">
                For live match updates, detailed statistics, bowling figures, fall of wickets, and complete team information, visit CPS Club on PlayHQ:
              </p>
              {PLAYHQ_COMPETITION_URL ? (
                <a
                  href={PLAYHQ_COMPETITION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--color-primary-2)] to-[var(--color-accent)] text-white font-black rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  🔗 View CPS Club on PlayHQ
                </a>
              ) : (
                <p className="text-sm text-gray-600">The current PlayHQ competition link has not been configured.</p>
              )}
            </div>
          </div>
        </div>

        {isLoadingMatches ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-600 shadow">
            Loading match details...
          </div>
        ) : matchesError ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center text-amber-900">
            <p className="font-semibold">Match details are currently unavailable.</p>
            <p className="mt-2 text-sm">{matchesError}</p>
          </div>
        ) : !matches.some((match) => match.status === 'COMPLETED') ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-600 shadow">
            No completed match results are available from the match data source.
          </div>
        ) : (
          <>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-dark)] mb-8 text-center">
              📋 Match Highlights
            </h2>
            <div className="space-y-8">
              {matches.filter((match) => match.status === 'COMPLETED').map((match) => {
                const isExpanded = expandedMatch === match.id;
                const activeTeam = selectedTab === 'team1' ? match.team1 : match.team2;

                return (
                  <div
                    key={match.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-[var(--color-accent)] transition-all duration-300"
                  >
                    {/* Match Header */}
                    <div
                      onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
                      className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-accent)] p-8 cursor-pointer hover:shadow-lg transition-all duration-300"
                    >
                      <div className="grid md:grid-cols-3 gap-6 text-white">
                        {/* Match Info */}
                        <div>
                          <p className="text-sm opacity-90 uppercase font-bold tracking-wide">Match</p>
                          <h3 className="text-2xl font-black">{match.matchName}</h3>
                          <p className="text-sm opacity-75 mt-1">{match.category}</p>
                        </div>

                        {/* Scores */}
                        <div className="flex items-center justify-center gap-6">
                          <div className="text-center">
                            <p className="text-sm opacity-90 font-bold uppercase tracking-wide">{match.team1.name}</p>
                            <p className="text-5xl font-black">{match.team1.score}</p>
                            <p className="text-sm opacity-75">{match.team1.wickets}/{match.team1.overs}</p>
                          </div>
                          <div className="text-2xl font-black opacity-75">vs</div>
                          <div className="text-center">
                            <p className="text-sm opacity-90 font-bold uppercase tracking-wide">{match.team2.name}</p>
                            <p className="text-5xl font-black">{match.team2.score}</p>
                            <p className="text-sm opacity-75">{match.team2.wickets}/{match.team2.overs}</p>
                          </div>
                        </div>

                        {/* Match Details */}
                        <div className="text-right">
                          <p className="text-sm opacity-90 uppercase font-bold tracking-wide">Result</p>
                          <p className="text-xl font-black mt-1">{match.result}</p>
                          <div className="flex gap-2 justify-end mt-3">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">{match.status}</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">📍 {match.venue.split(' ')[0]}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="p-8 bg-gray-50 border-t-2 border-gray-200">
                        {/* Match Info */}
                        <div className="mb-8 pb-8 border-b-2 border-gray-300">
                          <div className="grid md:grid-cols-3 gap-6">
                            <div>
                              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Venue</p>
                              <p className="text-lg font-bold text-gray-800">{match.venue}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Date</p>
                              <p className="text-lg font-bold text-gray-800">{match.date}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Category</p>
                              <p className="text-lg font-bold text-gray-800">{match.category}</p>
                            </div>
                          </div>
                        </div>

                        {/* Match Commentary */}
                        {match.commentary && (
                          <div className="mb-8 pb-8 border-b-2 border-gray-300 bg-blue-50 p-6 rounded-lg">
                            <p className="text-xs text-[var(--color-primary)] font-bold uppercase tracking-wide mb-3">📝 Match Commentary</p>
                            <p className="text-gray-700 leading-relaxed text-base">{match.commentary}</p>
                          </div>
                        )}

                        {!!match.highlights?.length && (
                          <div className="mb-8 rounded-lg border-b-2 border-gray-300 bg-amber-50 p-6">
                            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-amber-800">Player highlights</p>
                            <ul className="list-inside list-disc space-y-1 text-gray-700">
                              {match.highlights.map((highlight, highlightIndex) => (
                                <li key={highlightIndex}>{highlight}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Scorecard Tabs */}
                        <div className="mb-6">
                          <div className="flex gap-4 border-b-2 border-gray-300">
                            <button
                              onClick={() => setSelectedTab('team1')}
                              className={`px-6 py-3 font-black uppercase tracking-wide transition-all duration-300 border-b-4 ${
                                selectedTab === 'team1'
                                  ? 'border-[var(--color-primary-2)] text-[var(--color-primary-2)]'
                                  : 'border-transparent text-gray-600 hover:text-gray-800'
                              }`}
                            >
                              🏏 {match.team1.name} Batting
                            </button>
                            <button
                              onClick={() => setSelectedTab('team2')}
                              className={`px-6 py-3 font-black uppercase tracking-wide transition-all duration-300 border-b-4 ${
                                selectedTab === 'team2'
                                  ? 'border-[var(--color-primary-2)] text-[var(--color-primary-2)]'
                                  : 'border-transparent text-gray-600 hover:text-gray-800'
                              }`}
                            >
                              🏏 {match.team2.name} Batting
                            </button>
                          </div>
                        </div>

                        {/* Batting Details Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white">
                                <th className="px-4 py-3 text-left font-black">Player</th>
                                <th className="px-4 py-3 text-center font-black">Runs</th>
                                <th className="px-4 py-3 text-center font-black">Balls</th>
                                <th className="px-4 py-3 text-center font-black">4s</th>
                                <th className="px-4 py-3 text-center font-black">6s</th>
                                <th className="px-4 py-3 text-center font-black">S/R</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeTeam.batting.map((player, pidx) => {
                                const strikeRate = ((player.runs / player.balls) * 100).toFixed(1);
                                return (
                                  <tr
                                    key={pidx}
                                    className={`border-b border-gray-200 ${pidx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                                  >
                                    <td className="px-4 py-4 font-semibold text-gray-800">{player.name}</td>
                                    <td className="px-4 py-4 text-center font-black text-lg text-[var(--color-primary-2)]">{player.runs}</td>
                                    <td className="px-4 py-4 text-center text-gray-700">{player.balls}</td>
                                    <td className="px-4 py-4 text-center font-semibold text-gray-700">{player.fours}</td>
                                    <td className="px-4 py-4 text-center font-semibold text-[var(--color-accent)]">{player.sixes}</td>
                                    <td className="px-4 py-4 text-center font-bold text-gray-700">{strikeRate}%</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Total Summary */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-2)]/10 rounded-lg border-2 border-[var(--color-primary-2)]/30">
                          <p className="text-center font-black text-lg text-[var(--color-dark)]">
                            Total: <span className="text-[var(--color-primary-2)]">{activeTeam.score}</span> runs from <span className="text-[var(--color-primary-2)]">{activeTeam.overs}</span> overs | <span className="text-[var(--color-accent)]">{activeTeam.wickets}</span> wickets
                          </p>
                        </div>

                        {PLAYHQ_COMPETITION_URL && (
                          <div className="mt-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                            <p className="text-center text-gray-700">
                              <span className="font-bold">📱 View on PlayHQ:</span>{' '}
                              <a href={PLAYHQ_COMPETITION_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline">
                                CPS Club competition
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-accent)] rounded-2xl p-12 text-white text-center">
          <h2 className="text-4xl font-black mb-4">🎯 CPS Club Cricket</h2>
          <p className="text-lg mb-6 opacity-95">
            Match data and player statistics are shown here when available from the configured sources.
          </p>
          {PLAYHQ_COMPETITION_URL && (
            <a
              href={PLAYHQ_COMPETITION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white text-[var(--color-primary)] font-black rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 uppercase tracking-wide"
            >
              Visit PlayHQ 🏏
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
