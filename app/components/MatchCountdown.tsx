'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function MatchCountdown() {
  const [countdown, setCountdown] = useState<CountdownData>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Next match date: 10 Jan 2026 at 2 PM
    const nextMatchDate = new Date('2026-01-10T14:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = nextMatchDate - now;

      if (timeLeft <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      setCountdown({
        days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] rounded-xl p-6 mb-3 min-w-24">
        <span className="text-4xl md:text-5xl font-extrabold text-white">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <p className="text-sm md:text-base font-semibold text-gray-600 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 bg-gradient-to-r from-blue-50 via-white to-green-50 rounded-3xl border border-gray-200">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-dark)] mb-4">
          Next Match <span className="text-[var(--color-primary)]">Countdown</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          CPSC vs Old Ignatians (Taronga)
        </p>
      </div>

      {/* Countdown Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <CountdownBox value={countdown.days} label="Days" />
        <CountdownBox value={countdown.hours} label="Hours" />
        <CountdownBox value={countdown.minutes} label="Minutes" />
        <CountdownBox value={countdown.seconds} label="Seconds" />
      </div>

      {/* Match Details */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Date & Time</p>
            <p className="text-xl font-bold text-[var(--color-dark)]">
              10 Jan 2026, 2:00 PM
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Venue</p>
            <p className="text-xl font-bold text-[var(--color-dark)]">
              Primrose Oval
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Match Type</p>
            <p className="text-xl font-bold text-[var(--color-dark)]">
              One Day
            </p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Link
          href="/register-interest"
          className="px-12 py-4 bg-[var(--color-accent)] text-[var(--color-dark)] font-black rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg uppercase tracking-wider hover:bg-[#FFC939]"
        >
          Register Interest
        </Link>
        <button className="px-8 py-4 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold rounded-lg hover:bg-[var(--color-primary)]/10 transition-all duration-300">
          View Details
        </button>
      </div>
    </section>
  );
}
