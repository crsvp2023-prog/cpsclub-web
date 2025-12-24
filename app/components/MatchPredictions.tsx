'use client';

import { useState } from 'react';

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

export default function MatchPredictions() {
  const [predictions] = useState<Prediction[]>([
    {
      id: '1',
      question: 'Who will win: CPSC vs Old Ignatians?',
      options: [
        { name: 'CPSC', votes: 234 },
        { name: 'Old Ignatians', votes: 156 },
      ],
      totalVotes: 390,
      matchDate: '25 Dec 2025',
    },
    {
      id: '2',
      question: 'Highest Run Scorer?',
      options: [
        { name: 'Player A', votes: 145 },
        { name: 'Player B', votes: 98 },
        { name: 'Player C', votes: 112 },
      ],
      totalVotes: 355,
      matchDate: '25 Dec 2025',
    },
  ]);

  const [userVotes, setUserVotes] = useState<{ [key: string]: number }>({});

  const handleVote = (predictionId: string, optionIndex: number) => {
    setUserVotes(prev => ({
      ...prev,
      [predictionId]: optionIndex,
    }));
  };

  const getPercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-dark)] mb-4">
          Match <span className="text-[var(--color-primary)]">Predictions</span>
        </h2>
        <p className="text-lg text-gray-600">Make your predictions and compete with fans!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {predictions.map(prediction => (
          <div
            key={prediction.id}
            className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
          >
            <div className="mb-6">
              <p className="text-sm font-semibold text-[var(--color-primary-2)] mb-2">
                {prediction.matchDate}
              </p>
              <h3 className="text-xl font-bold text-[var(--color-dark)]">
                {prediction.question}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {prediction.totalVotes.toLocaleString()} votes
              </p>
            </div>

            <div className="space-y-4">
              {prediction.options.map((option, index) => {
                const percentage = getPercentage(option.votes, prediction.totalVotes);
                const isSelected = userVotes[prediction.id] === index;

                return (
                  <button
                    key={index}
                    onClick={() => handleVote(prediction.id, index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 border-2 ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                        : 'border-gray-200 hover:border-[var(--color-primary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-dark)]'}`}>
                        {option.name}
                      </span>
                      <span className="text-sm font-bold text-[var(--color-primary)]">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] h-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {option.votes.toLocaleString()} votes
                    </p>
                  </button>
                );
              })}
            </div>

            {userVotes[prediction.id] !== undefined && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-700">
                  ✓ Your vote recorded! Good luck!
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
          View All Predictions
        </button>
      </div>
    </section>
  );
}
