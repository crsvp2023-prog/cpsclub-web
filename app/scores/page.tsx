'use client';

import { useState, useEffect } from 'react';

const seasonInfo = {
  season: "Summer 2025/26",
  category: "Northern Cricket Union (Northern Suburbs Cricket Association NSW) - Grade C",
  format: "One Day Cricket",
  matches_played: 11,
  matches_total: 27,
  startDate: "October 7, 2025",
  endDate: "March 28, 2026"
};

const defaultStandings = [
  { position: 1, team: "CPS Club", played: 8, wins: 7, losses: 1, points: 14, nrr: "+0.85" },
  { position: 2, team: "Eastern Suburbs", played: 8, wins: 6, losses: 2, points: 12, nrr: "+0.52" },
  { position: 3, team: "North Sydney", played: 8, wins: 5, losses: 3, points: 10, nrr: "-0.18" },
  { position: 4, team: "Parramatta", played: 8, wins: 4, losses: 4, points: 8, nrr: "+0.22" },
  { position: 5, team: "Strathfield", played: 8, wins: 3, losses: 5, points: 6, nrr: "-0.45" },
  { position: 6, team: "Cronulla-Sutherland", played: 8, wins: 2, losses: 6, points: 4, nrr: "-0.62" }
];

const matchesData = [
  {
    id: 1,
    matchName: "CPS Club vs North Sydney",
    category: "Northern Cricket Union - Grade C",
    date: "December 21, 2025",
    venue: "Chatswood Premier Sports Club",
    status: "COMPLETED",
    result: "CPS Club won by 28 runs",
    team1: {
      name: "CPS Club",
      score: 168,
      wickets: 6,
      overs: "20.0",
      batting: [
        { name: "Mark Richardson", runs: 54, balls: 32, fours: 6, sixes: 2 },
        { name: "Andrew Thompson", runs: 48, balls: 35, fours: 4, sixes: 2 },
        { name: "James Mitchell", runs: 31, balls: 24, fours: 3, sixes: 1 },
        { name: "Steven Walsh", runs: 22, balls: 18, fours: 2, sixes: 0 },
        { name: "Others", runs: 13, balls: 11, fours: 1, sixes: 0 }
      ]
    },
    team2: {
      name: "North Sydney",
      score: 140,
      wickets: 8,
      overs: "20.0",
      batting: [
        { name: "Peter Hayes", runs: 45, balls: 28, fours: 5, sixes: 1 },
        { name: "Matthew Cooper", runs: 35, balls: 26, fours: 3, sixes: 1 },
        { name: "Richard Bennett", runs: 28, balls: 22, fours: 2, sixes: 1 },
        { name: "John Sullivan", runs: 18, balls: 16, fours: 1, sixes: 0 },
        { name: "Others", runs: 14, balls: 12, fours: 1, sixes: 0 }
      ]
    }
  },
  {
    id: 2,
    matchName: "CPS Club vs Eastern Suburbs",
    category: "Northern Cricket Union - Grade C",
    date: "December 14, 2025",
    venue: "Chatswood Premier Sports Club",
    status: "COMPLETED",
    result: "CPS Club won by 18 runs",
    team1: {
      name: "CPS Club",
      score: 152,
      wickets: 7,
      overs: "20.0",
      batting: [
        { name: "Mark Richardson", runs: 46, balls: 28, fours: 4, sixes: 2 },
        { name: "Andrew Thompson", runs: 39, balls: 30, fours: 3, sixes: 1 },
        { name: "Daniel Edwards", runs: 28, balls: 20, fours: 3, sixes: 0 },
        { name: "Kevin Brown", runs: 19, balls: 15, fours: 2, sixes: 0 },
        { name: "Others", runs: 20, balls: 17, fours: 1, sixes: 1 }
      ]
    },
    team2: {
      name: "Eastern Suburbs",
      score: 134,
      wickets: 9,
      overs: "20.0",
      batting: [
        { name: "Paul Jackson", runs: 42, balls: 26, fours: 4, sixes: 1 },
        { name: "Stephen Clarke", runs: 31, balls: 28, fours: 2, sixes: 1 },
        { name: "Michael Foster", runs: 24, balls: 20, fours: 2, sixes: 0 },
        { name: "Anthony Dawson", runs: 18, balls: 14, fours: 1, sixes: 0 },
        { name: "Others", runs: 19, balls: 16, fours: 1, sixes: 0 }
      ]
    }
  }
];

export default function ScoresPage() {
  const [expandedMatch, setExpandedMatch] = useState<number | null>(0);
  const [selectedTab, setSelectedTab] = useState<'team1' | 'team2'>('team1');
  const [standings, setStandings] = useState(defaultStandings);
  const [matches, setMatches] = useState(matchesData);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [scrapeMessage, setScrapeMessage] = useState('');

  // Load standings and matches on mount
  useEffect(() => {
    loadStandings();
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await fetch('/matches-data.json');
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || matchesData);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      setMatches(matchesData);
    }
  };

  const loadStandings = async () => {
    try {
      const response = await fetch('/playhq-data.json');
      if (response.ok) {
        const data = await response.json();
        setStandings(data.standings || defaultStandings);
        setLastUpdated(data.lastUpdated || '');
      }
    } catch (error) {
      console.error('Error loading standings:', error);
      setStandings(defaultStandings);
    }
  };

  const handleScrapePlayHQ = async () => {
    setIsLoading(true);
    setScrapeMessage('');
    try {
      const response = await fetch('/api/scrape-playhq');
      const data = await response.json();
      
      if (response.ok) {
        setScrapeMessage('✅ Data updated from PlayHQ successfully!');
        await loadStandings();
      } else {
        setScrapeMessage(`⚠️ ${data.error || 'Failed to fetch data'}`);
      }
    } catch (error) {
      setScrapeMessage('❌ Error: Could not reach PlayHQ. Check console for details.');
      console.error('Scrape error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setScrapeMessage(''), 5000);
    }
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
            <span className="text-3xl animate-pulse">🔴</span>
            <div>
              <p className="font-black text-white uppercase tracking-wide">Live Scores Available</p>
              <p className="text-white/90 text-sm">View complete match data and team statistics on PlayHQ</p>
            </div>
          </div>
          <a
            href="https://www.playhq.com/cricket-australia/org/chatswood-premier-sports-club/829b8e20/northern-cricket-union-summer-202526/teams/c1-chatswood-premier/c820ec75/ladder"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-[var(--color-primary)] font-black rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
          >
            VIEW LIVE SCORES 📊
          </a>
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
          Northern Cricket Union (NCU) Grade C Summer 2025/26 Season
        </p>

        {/* Season Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm font-bold uppercase">Season</p>
            <p className="text-white text-2xl font-black">{seasonInfo.season}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm font-bold uppercase">Format</p>
            <p className="text-white text-2xl font-black">{seasonInfo.format}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm font-bold uppercase">Matches</p>
            <p className="text-white text-2xl font-black">{seasonInfo.matches_played}/{seasonInfo.matches_total}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm font-bold uppercase">Duration</p>
            <p className="text-white text-lg font-black">Dec - Feb</p>
          </div>
        </div>
      </section>

      {/* Standings Section */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-dark)] mb-8 text-center">
          🏆 Season Standings
        </h2>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
          {/* Header with Scrape Button */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-gray-700 font-semibold">📊 Live data from PlayHQ</p>
                {lastUpdated && (
                  <p className="text-sm text-gray-600 mt-1">
                    Last updated: {new Date(lastUpdated).toLocaleDateString()} {new Date(lastUpdated).toLocaleTimeString()}
                  </p>
                )}
              </div>
              <button
                onClick={handleScrapePlayHQ}
                disabled={isLoading}
                className={`px-6 py-3 font-black rounded-lg whitespace-nowrap transition-all duration-300 ${
                  isLoading
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {isLoading ? '⏳ Updating...' : '🔄 Refresh from PlayHQ'}
              </button>
            </div>
            {scrapeMessage && (
              <p className="text-center mt-4 text-sm font-semibold">{scrapeMessage}</p>
            )}
          </div>

          {/* Standings Table */}
          <div className="overflow-x-auto">
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
              <a
                href="https://www.playhq.com/cricket-australia/org/chatswood-premier-sports-club/829b8e20/northern-cricket-union-summer-202526/teams/c1-chatswood-premier/c820ec75/ladder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--color-primary-2)] to-[var(--color-accent)] text-white font-black rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                🔗 View CPS Club on PlayHQ
              </a>
            </div>
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-dark)] mb-8 text-center">
          📋 Match Highlights
        </h2>
        <div className="space-y-8">
          {matches.map((match, idx) => {
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
                        <p className="text-sm opacity-90 font-bold uppercase tracking-wide">CPS Club</p>
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

                    {/* PlayHQ Link */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <p className="text-center text-gray-700">
                        <span className="font-bold">📱 View on PlayHQ:</span> For detailed bowling, fall of wickets, and more info visit{' '}
                        <a href="https://www.playhq.com/cricket-australia/org/chatswood-premier-sports-club/829b8e20/northern-cricket-union-summer-202526/teams/c1-chatswood-premier/c820ec75/ladder" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">
                          CPS Club on PlayHQ
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-accent)] rounded-2xl p-12 text-white text-center">
          <h2 className="text-4xl font-black mb-4">🎯 View CPS Club Team</h2>
          <p className="text-lg mb-6 opacity-95">
            Track all Northern Cricket Union (NCU) Grade C matches and player statistics on PlayHQ
          </p>
          <a
            href="https://www.playhq.com/cricket-australia/org/chatswood-premier-sports-club/829b8e20/northern-cricket-union-summer-202526/teams/c1-chatswood-premier/c820ec75/ladder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-white text-[var(--color-primary)] font-black rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 uppercase tracking-wide"
          >
            Visit PlayHQ 🏏
          </a>
        </div>
      </section>
    </main>
  );
}
