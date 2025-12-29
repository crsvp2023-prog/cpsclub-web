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

const PREDICTIONS_DATA: Prediction[] = [
  {
    id: '1',
    question: 'Who will win: CPSC vs Old Ignatians?',
    options: [
      { name: 'CPSC', votes: 234 },
      { name: 'Old Ignatians', votes: 156 },
    ],
    totalVotes: 390,
    matchDate: 'Jan 10, 2026',
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
    matchDate: 'Jan 10, 2026',
  },
  {
    id: '3',
    question: 'Will we see a century?',
    options: [
      { name: 'Yes', votes: 187 },
      { name: 'No', votes: 142 },
    ],
    totalVotes: 329,
    matchDate: 'Jan 15, 2026',
  },
];

export default function MatchPredictions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [predictions, setPredictions] = useState<Prediction[]>(PREDICTIONS_DATA);
  const [userVotes, setUserVotes] = useState<{ [key: string]: number }>({});

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
    const voteData = {
      predictionId,
      optionIndex,
      userId: 'anonymous',
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
    <section className="relative w-full h-full">
      <div className="w-full h-full px-6 py-8 bg-gradient-to-br from-[var(--color-primary-2)] via-[#0052CC] to-[var(--color-primary)] rounded-2xl border border-[var(--color-accent)]/30 flex flex-col">
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
