'use client';

import { useState, useEffect } from 'react';

interface Series {
  id: string;
  name: string;
  icon: string;
  bgGradient: string;
  badgeColor: string;
  stats: {
    matches: number;
    teams: number;
    upcoming: number;
  };
  description: string;
  link?: string;
}

const FEATURED_SERIES: Series[] = [
  {
    id: 'ncu-senior',
    name: 'NCU Senior Championship',
    icon: '👨‍💼',
    bgGradient: 'from-[#003B82] to-[#0052CC]',
    badgeColor: 'bg-[#FFB81C]',
    stats: {
      matches: 24,
      teams: 12,
      upcoming: 3
    },
    description: 'Elite senior cricket tournament'
  },
  {
    id: 'smca',
    name: 'SMCA Premier League',
    icon: '🏆',
    bgGradient: 'from-[#0052CC] to-[#003B82]',
    badgeColor: 'bg-[#FFB81C]',
    stats: {
      matches: 32,
      teams: 14,
      upcoming: 5
    },
    description: 'Premier SMCA competition',
    link: 'https://cpsclub.com.au/?page_id=547'
  },
  {
    id: 'ncu-juniors',
    name: 'NCU Junior Development',
    icon: '⚡',
    bgGradient: 'from-[#001a4d] to-[#003B82]',
    badgeColor: 'bg-[#FFB81C]',
    stats: {
      matches: 18,
      teams: 10,
      upcoming: 2
    },
    description: 'Next generation cricketers'
  }
];

export default function FeaturedSeries() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === FEATURED_SERIES.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? FEATURED_SERIES.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === FEATURED_SERIES.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % FEATURED_SERIES.length;
      cards.push({ ...FEATURED_SERIES[index], position: i });
    }
    return cards;
  };

  return (
    <section className="relative py-12 px-6 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white">
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#0052CC] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute -bottom-8 left-10 w-72 h-72 bg-[#FFB81C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600 text-sm">
            Catch all the action from our upcoming tournaments
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Cards Grid - 3 visible at a time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {getVisibleCards().map((series) => (
              <div
                key={series.id}
                className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer h-64 md:h-72"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${series.bgGradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Content Overlay */}80 via-transparent to-transparent flex flex-col justify-between p-4 md:p-6 group-hover:from-black/60 transition-all duration-300
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-between p-4 md:p-6">
                  {/* Top Section - Badge */}
                  <div className="flex items-start justify-between">
                    <div className="text-3xl md:text-4xl">{series.icon}</div>
                    <span className={`px-2 py-1 rounded-md ${series.badgeColor} text-[var(--color-dark)] text-xs font-black uppercase tracking-wider`}>
                      LIVE
                    </span>
                  </div>

                  {/* Bottom Section - Title & Info */}
                  <div className="relative z-10">
                    <h3 className="text-lg md:text-xl font-black text-white mb-2 leading-tight">
                      {series.name}
                    </h3>
                    <p className="text-white/80 text-xs md:text-sm font-semibold mb-3">
                      {series.stats.matches} Matches • {series.stats.teams} Teams
                    </p>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-lg transition-all duration-300" />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute -left-5 md:-left-12 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-[#003B82] to-[#0052CC] text-white font-black text-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
            aria-label="Previous"
          >
            ←
          </button>

          <button
            onClick={goToNext}
            className="absolute -right-5 md:-right-12 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-[#003B82] to-[#0052CC] text-white font-black text-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
            aria-label="Next"
          >
            →
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {FEATURED_SERIES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 bg-gradient-to-r from-[#FFB81C] to-[#FFD84D]'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to series ${index + 1}`}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <a
            href="/scores"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#003B82] via-[#0052CC] to-[#FFB81C] text-white font-black rounded-lg text-sm uppercase tracking-wider hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            View All Scores →
          </a>
        </div>
      </div>
    </section>
  );
}
