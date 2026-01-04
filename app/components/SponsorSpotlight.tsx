'use client';

import { useState, useEffect } from 'react';
import { sponsors } from '@/app/data/sponsors';

export default function SponsorSpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Use all sponsors since they don't have categories
  const featuredSponsors = sponsors.slice(0, sponsors.length);

  useEffect(() => {
    if (!autoPlay || featuredSponsors.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredSponsors.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlay, featuredSponsors.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % featuredSponsors.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + featuredSponsors.length) % featuredSponsors.length);
    setAutoPlay(false);
  };

  if (featuredSponsors.length === 0) return null;

  const currentSponsor = featuredSponsors[currentIndex];

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 bg-gradient-to-br from-[var(--color-primary)] via-[#0052CC] to-[var(--color-primary-2)] rounded-3xl">
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-2 bg-[var(--color-accent)]/20 rounded-full border border-[var(--color-accent)]/50 mb-4">
          <p className="text-sm font-semibold text-white">Featured Partner</p>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          Sponsor <span className="text-[var(--color-accent)]">Spotlight</span>
        </h2>
        <p className="text-base text-white/80">Proudly supported by our amazing partners</p>
      </div>

      {/* Main Carousel */}
      <div className="relative mb-6">
        <div className="bg-white/95 rounded-2xl shadow-xl overflow-hidden border border-white/30">
          <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
            {/* Logo/Image Side */}
            <div className="flex items-center justify-center bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 min-h-48">
              <div className="text-center">
                <img 
                  src={currentSponsor.logo || "/images/sponsors/default.png"} 
                  alt={currentSponsor.name}
                  className="h-24 w-auto mx-auto object-contain mb-3"
                />
                <p className="text-lg font-bold text-[var(--color-dark)]">
                  {currentSponsor.name}
                </p>
              </div>
            </div>

            {/* Info Side */}
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-3">
                {currentSponsor.name}
              </h3>
              
              <div className="bg-blue-50/50 rounded-lg p-4 mb-4 border border-[var(--color-primary)]/20">
                <p className="text-[#0d3e2a] leading-relaxed text-base font-bold">
                  "{currentSponsor.description}"
                </p>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  <p className="text-gray-700 text-sm">Premium sponsorship package included</p>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  <p className="text-gray-700 text-sm">Featured in all marketing materials</p>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  <p className="text-gray-700 text-sm">Exclusive networking events</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href={currentSponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-2 bg-[var(--color-accent)] text-[var(--color-dark)] font-black rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 text-center text-sm uppercase tracking-wider hover:bg-[#FFC939]"
                >
                  Visit Website
                </a>
                <a 
                  href="/sponsorship"
                  className="flex-1 px-6 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 text-center text-sm"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:translate-x-0 md:left-3 bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] p-2 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 z-10"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-0 md:right-3 bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] p-2 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 z-10"
        >
          →
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center items-center gap-3 mb-12">
        {featuredSponsors.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/30 w-3 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Sponsor Grid - Show All */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-white mb-2">
          All Our Partners
        </h3>
        <p className="text-sm text-white/80 max-w-2xl mx-auto">
          Thank you to our primary sponsors and official partners who power the vision of{' '}
          <span className="font-semibold text-[var(--color-accent)]">Chatswood Premier Sports Club</span>.
        </p>
      </div>

      {/* Two moving rows of sponsors */}
      <div className="space-y-6">
        {/* Row 1: Primary sponsors */}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 justify-center animate-sponsor-row-left">
            {sponsors.filter(s => s.tier === 'primary').map((sponsor, index) => (
              <a
                key={`${sponsor.name}-primary-${index}`}
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="relative bg-white/95 rounded-2xl p-6 shadow-md border border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/60 flex flex-col items-center justify-between min-h-40 w-56 group cursor-pointer overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-accent)]/5" />

                <span className="relative mb-2 inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-[0.7rem] font-semibold px-3 py-1 uppercase tracking-wide">
                  Primary Sponsor
                </span>

                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="relative h-20 w-auto object-contain mb-3 group-hover:scale-110 transition-transform duration-300"
                />
                <p className="relative text-sm font-semibold text-center text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors">
                  {sponsor.name}
                </p>
                {sponsor.role && (
                  <p className="relative mt-1 text-[0.7rem] font-semibold uppercase tracking-wide text-amber-600">
                    {sponsor.role}
                  </p>
                )}
                <button
                  className="relative mt-3 inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold tracking-wide uppercase shadow-sm group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-dark)] transition-colors"
                >
                  Visit Website →
                </button>
              </a>
            ))}
          </div>
        </div>

        {/* Row 2: Training / clothing partners */}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 justify-center animate-sponsor-row-right">
            {sponsors.filter(s => s.tier !== 'primary').map((sponsor, index) => (
              <a
                key={`${sponsor.name}-partner-${index}`}
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="relative bg-white/90 rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col items-center justify-between min-h-40 w-56 group cursor-pointer overflow-hidden hover:border-[var(--color-primary)] hover:shadow-lg hover:scale-105 transition-transform duration-300 opacity-95"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-accent)]/5" />

                {sponsor.role && (
                  <span className="relative mb-2 inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-[0.7rem] font-semibold px-3 py-1 uppercase tracking-wide">
                    {sponsor.role}
                  </span>
                )}

                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="relative h-20 w-auto object-contain mb-3 group-hover:scale-110 transition-transform duration-300 grayscale-[25%] group-hover:grayscale-0"
                />
                <p className="relative text-sm font-semibold text-center text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors">
                  {sponsor.name}
                </p>
                <button
                  className="relative mt-3 inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white text-[var(--color-primary)] text-xs font-semibold tracking-wide uppercase shadow-sm group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors"
                >
                  Visit Website →
                </button>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Become a Sponsor CTA */}
      <div className="mt-16 bg-white/10 rounded-2xl p-12 text-center border-2 border-dashed border-white/40">
        <h3 className="text-3xl font-bold text-white mb-4">
          Want to Become a Sponsor?
        </h3>
        <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
          Join our growing network of sponsors and gain exposure to thousands of cricket fans. 
          Perfect for local businesses looking to grow their brand!
        </p>
        <a 
          href="/sponsorship"
          className="inline-block px-10 py-4 bg-[var(--color-accent)] text-[var(--color-dark)] font-black rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 uppercase tracking-wider hover:bg-[#FFC939]"
        >
          Explore Sponsorship Opportunities
        </a>
      </div>

      <style jsx>{`
        @keyframes sponsor-row-left {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-12px);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes sponsor-row-right {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(12px);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-sponsor-row-left {
          animation: sponsor-row-left 8s ease-in-out infinite;
        }

        .animate-sponsor-row-right {
          animation: sponsor-row-right 8s ease-in-out infinite;
        }

        .animate-sponsor-row-left:hover,
        .animate-sponsor-row-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
