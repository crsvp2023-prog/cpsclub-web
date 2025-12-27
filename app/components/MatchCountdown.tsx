'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Match {
  id: number;
  opponent: string;
  date: string;
  time: string;
  venue: string;
  matchDate: Date;
}

const UPCOMING_MATCHES: Match[] = [
  {
    id: 1,
    opponent: 'CPSC vs Old Ignatians (Taronga)',
    date: '10 Jan',
    time: '1:00 PM',
    venue: 'Primrose Oval',
    matchDate: new Date('2026-01-10T13:00:00'),
  },
  {
    id: 2,
    opponent: 'CPSC vs Strathfield',
    date: '17 Jan',
    time: '1:00 PM',
    venue: 'Chatswood Oval',
    matchDate: new Date('2026-01-17T13:00:00'),
  },
  {
    id: 3,
    opponent: 'CPSC vs Mosman',
    date: '24 Jan',
    time: '1:00 PM',
    venue: 'Mosman Oval',
    matchDate: new Date('2026-01-24T13:00:00'),
  },
];

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function MatchCountdown() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdowns, setCountdowns] = useState<CountdownData[]>(
    UPCOMING_MATCHES.map(() => ({ days: 0, hours: 0, minutes: 0, seconds: 0 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(
        UPCOMING_MATCHES.map((match) => {
          const now = new Date().getTime();
          const timeLeft = match.matchDate.getTime() - now;

          if (timeLeft <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
          }

          return {
            days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
            hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? UPCOMING_MATCHES.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === UPCOMING_MATCHES.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentMatch = UPCOMING_MATCHES[currentIndex];
  const countdown = countdowns[currentIndex];

const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] rounded-md sm:rounded-lg p-2 sm:p-3 mb-1 sm:mb-2 min-w-14 sm:min-w-20">
        <span className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );

  return (
    <section className="relative w-full h-full px-4 sm:px-0">
      <div className="w-full h-full px-4 sm:px-6 py-6 sm:py-8 bg-gradient-to-br from-[#0052CC] via-[#0066FF] to-[#003B82] rounded-xl sm:rounded-2xl border border-[var(--color-accent)]/30 flex flex-col">
        {/* Title */}
        <div className="text-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#0d3e2a]">
            Next Match <span className="text-[var(--color-accent)]">Countdown</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#1a5640] mt-1 line-clamp-2">
            {currentMatch.opponent}
          </p>
        </div>

        {/* Countdown Display */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-3 sm:mb-4">
          <CountdownBox value={countdown.days} label="Days" />
          <CountdownBox value={countdown.hours} label="Hours" />
          <CountdownBox value={countdown.minutes} label="Minutes" />
          <CountdownBox value={countdown.seconds} label="Seconds" />
        </div>

        {/* Match Details */}
        <div className="bg-white rounded-lg p-2 sm:p-3 mb-3 sm:mb-4 shadow-lg flex-1">
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-0.5 font-semibold">Date & Time</p>
              <p className="text-xs font-bold text-[var(--color-dark)]">
                {currentMatch.date}, {currentMatch.time}
              </p>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <p className="text-xs text-gray-600 mb-0.5 font-semibold">Venue</p>
              <p className="text-xs font-bold text-[var(--color-dark)]">
                {currentMatch.venue}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-0.5 font-semibold">Type</p>
              <p className="text-xs font-bold text-[var(--color-dark)]">
                One Day
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/register-interest"
            className="px-4 sm:px-6 py-2 bg-[var(--color-accent)] text-[var(--color-dark)] font-black rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs uppercase tracking-wider hover:bg-[#FFC939] w-full sm:w-auto text-center"
          >
            Register Interest
          </Link>
        </div>
      </div>

      {/* Carousel Navigation - Only show if multiple matches */}
      {UPCOMING_MATCHES.length > 1 && (
        <div className="flex justify-center gap-2 sm:gap-4 mt-3">
          <button
            onClick={goToPrevious}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-primary)] text-white font-bold hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-xs sm:text-sm"
            aria-label="Previous"
          >
            ←
          </button>
          <div className="flex gap-2 items-center">
            {UPCOMING_MATCHES.map((_, index) => (
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
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-primary)] text-white font-bold hover:shadow-lg hover:scale-110 transition-all flex items-center justify-center text-xs sm:text-sm"
            aria-label="Next"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
