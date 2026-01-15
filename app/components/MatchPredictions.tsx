'use client';

import { useState, useEffect } from 'react';

interface Prediction {
  id: string;
  question: string;
  options: {
    name: string;
    votes: number;
  }[];
  totalVotes: number;
  matchDate: string;
}

type MatchesDataFile = {
  matches?: Array<{
    id?: number;
    gameId?: string;
    gameCode?: string;
    matchName?: string;
    date?: string;
    time?: string;
    startDateTime?: string;
    venue?: string;
    status?: string;
    team1?: { name?: string };
    team2?: { name?: string };
  }>;
};

type MatchesApiResponse =
  | { success: true; data: MatchesDataFile }
  | { success: false; error?: string };

const PREDICTIONS_DATA: Prediction[] = [];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function pickNextUpcomingMatch(
  matches: NonNullable<MatchesDataFile['matches']>
): NonNullable<MatchesDataFile['matches']>[number] | null {
  const now = new Date();

  const parsed = matches
    .map((m) => {
      const when = new Date(m.startDateTime || m.date || '');
      return {
        m,
        when,
      };
    })
    .filter(({ when }) => !Number.isNaN(when.getTime()))
    .filter(({ m, when }) => (m.status ?? '').toUpperCase() === 'UPCOMING' && when.getTime() > now.getTime())
    .sort((a, b) => a.when.getTime() - b.when.getTime());

  return parsed.length > 0 ? parsed[0].m : null;
}

function buildPredictionId(match: NonNullable<ReturnType<typeof pickNextUpcomingMatch>>): string {
  if (match.gameId) return match.gameId;
  if (match.gameCode) return `game_${match.gameCode}`;

  const a = match.team1?.name || 'team-a';
  const b = match.team2?.name || 'team-b';
  const dateKey = (match.startDateTime || match.date || '').replace(/[^0-9]/g, '').slice(0, 8) || 'match';
  return `match_${dateKey}_${slugify(a)}_vs_${slugify(b)}`;
}

function buildLocalPrediction(match: NonNullable<ReturnType<typeof pickNextUpcomingMatch>>): Prediction {
  const teamA = match.team1?.name || 'Team A';
  const teamB = match.team2?.name || 'Team B';
  const matchDateKey = match.startDateTime || match.date || '';
  const matchDateLabel = [match.date, match.time].filter(Boolean).join(' • ') || matchDateKey || 'TBC';

  return {
    id: buildPredictionId(match),
    question: `Who will win: ${teamA} vs ${teamB}?`,
    options: [
      { name: teamA, votes: 0 },
      { name: teamB, votes: 0 },
    ],
    totalVotes: 0,
    matchDate: matchDateLabel,
  };
}

export default function MatchPredictions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [predictions, setPredictions] = useState<Prediction[]>(PREDICTIONS_DATA);
  const [userVotes, setUserVotes] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Load the current match and its prediction on mount
  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      try {
        const matchesRes = await fetch('/api/update-matches', { cache: 'no-store' });
        if (!matchesRes.ok) throw new Error(`HTTP ${matchesRes.status}: Failed to load matches`);

        const api = (await matchesRes.json()) as MatchesApiResponse;
        const matchesData = api && api.success ? api.data : { matches: [] };
        const match = pickNextUpcomingMatch(matchesData.matches ?? []);

        if (!match) {
          if (!isCancelled) setPredictions([]);
          return;
        }

        const localPrediction = buildLocalPrediction(match);
        const predictionId = localPrediction.id;

        // Default UI immediately, then overwrite with Firestore data if present
        if (!isCancelled) {
          setPredictions([localPrediction]);
          setCurrentIndex(0);
        }

        const predictionRes = await fetch(`/api/predictions/vote?predictionId=${encodeURIComponent(predictionId)}`, {
          cache: 'no-store',
        });

        if (predictionRes.ok) {
          const p = (await predictionRes.json()) as Prediction;
          if (!isCancelled && p?.options?.length) {
            setPredictions([{
              ...localPrediction,
              ...p,
              // Keep our matchDate label if backend stored a raw date string
              matchDate: localPrediction.matchDate,
            }]);
            setCurrentIndex(0);
          }
        }
      } catch (error) {
        console.error('Failed to load match predictions:', error);
        if (!isCancelled) setPredictions([]);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    load();
    return () => {
      isCancelled = true;
    };
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? predictions.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === predictions.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentPrediction = predictions[currentIndex];

  if (loading) {
    return (
      <section className="relative w-full h-full">
        <div className="w-full h-full px-6 py-8 bg-gradient-to-br from-[var(--color-primary-2)] via-[#0052CC] to-[var(--color-primary)] rounded-2xl border border-[var(--color-accent)]/30 flex flex-col items-center justify-center">
          <p className="text-white">Loading predictions...</p>
        </div>
      </section>
    );
  }

  if (!currentPrediction) {
    return (
      <section className="relative w-full h-full">
        <div className="w-full h-full px-6 py-8 bg-gradient-to-br from-[var(--color-primary-2)] via-[#0052CC] to-[var(--color-primary)] rounded-2xl border border-[var(--color-accent)]/30 flex flex-col items-center justify-center">
          <p className="text-white">No predictions available</p>
        </div>
      </section>
    );
  }

  const handleVote = (predictionId: string, optionIndex: number) => {
    // Check if user already voted for this prediction
    if (userVotes[predictionId] !== undefined) {
      return; // User already voted
    }

    // Update vote counts in the predictions
    setPredictions(prev => 
      prev.map(pred => {
        if (pred.id === predictionId) {
          const updatedOptions = pred.options.map((option, idx) => ({
            ...option,
            votes: idx === optionIndex ? option.votes + 1 : option.votes
          }));
          return {
            ...pred,
            options: updatedOptions,
            totalVotes: pred.totalVotes + 1
          };
        }
        return pred;
      })
    );

    // Record user vote
    setUserVotes(prev => ({
      ...prev,
      [predictionId]: optionIndex,
    }));

    // Optional: Send to API for logging (fire and forget)
    const current = predictions.find((p) => p.id === predictionId);
    const voteData = {
      predictionId,
      optionIndex,
      userId: 'anonymous',
      // Provide creation fields so the backend can auto-create a new prediction doc for the current match
      question: current?.question,
      matchDate: current?.matchDate,
      options: current?.options?.map((o) => ({ name: o.name })),
    };
    console.log('Sending vote data:', voteData);
    
    fetch('/api/predictions/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(voteData),
    })
    .then(res => res.json())
    .then(data => console.log('Vote response:', data))
    .catch(error => {
      console.error('Vote error:', error);
    });
  };

  const getPercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <section className="relative w-full min-h-fit">
      <div className="w-full px-6 py-8 bg-gradient-to-br from-[var(--color-primary-2)] via-[#0052CC] to-[var(--color-primary)] rounded-2xl border border-[var(--color-accent)]/30 flex flex-col">
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-white">
            Match <span className="text-[var(--color-accent)]">Predictions</span>
          </h2>
          <p className="text-xs md:text-sm text-[#0d3e2a] mt-1">
            Make your predictions and compete with fans!
          </p>
        </div>

        {/* Prediction Card */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-3 shadow-lg border border-blue-200 mb-4 flex-1 flex flex-col">
          <div className="mb-3">
            <p className="text-xs font-semibold text-[var(--color-primary-2)] mb-0.5">
              {currentPrediction.matchDate}
            </p>
            <h3 className="text-base font-bold text-[var(--color-dark)]">
              {currentPrediction.question}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {currentPrediction.totalVotes.toLocaleString()} votes
            </p>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto">
            {currentPrediction.options.map((option, index) => {
              const percentage = getPercentage(option.votes, currentPrediction.totalVotes);
              const isSelected = userVotes[currentPrediction.id] === index;

              return (
                <button
                  key={index}
                  onClick={() => handleVote(currentPrediction.id, index)}
                  className={`w-full text-left p-1.5 rounded-lg transition-all duration-300 border-2 text-xs ${
                    isSelected
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                      : 'border-gray-200 hover:border-[var(--color-primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`font-semibold text-xs ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-dark)]'}`}>
                      {option.name}
                    </span>
                    <span className="text-xs font-bold text-[var(--color-primary)]">
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] h-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {option.votes.toLocaleString()} votes
                  </p>
                </button>
              );
            })}
          </div>

          {userVotes[currentPrediction.id] !== undefined && (
            <div className="mt-2 p-1.5 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs font-semibold text-green-700">
                ✓ Vote recorded!
              </p>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => {
              // Find the selected option index
              const selectedIndex = userVotes[currentPrediction.id];
              if (selectedIndex !== undefined) {
                handleVote(currentPrediction.id, selectedIndex);
              } else {
                alert('Please select an option first!');
              }
            }}
            disabled={userVotes[currentPrediction.id] !== undefined}
            className={`px-6 py-2 font-black rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs uppercase tracking-wider ${
              userVotes[currentPrediction.id] !== undefined
                ? 'bg-green-500 text-white cursor-not-allowed opacity-80'
                : 'bg-[var(--color-accent)] text-[var(--color-dark)] hover:bg-[#FFC939]'
            }`}
          >
            {userVotes[currentPrediction.id] !== undefined ? '✓ Voted' : 'Vote Now'}
          </button>
        </div>
      </div>

      {/* Carousel Navigation - Only show if multiple predictions */}
      {predictions.length > 1 && (
        <div className="flex justify-center gap-4 mt-3">
          <button
            onClick={goToPrevious}
            className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white font-bold hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-sm"
            aria-label="Previous"
          >
            ←
          </button>
          <div className="flex gap-2 items-center">
            {predictions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-6 bg-[var(--color-primary)]'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          <button
            onClick={goToNext}
            className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white font-bold hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-sm"
            aria-label="Next"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
