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

  const primarySponsors = sponsors.filter(s => s.tier === 'primary');
  const partnerSponsors = sponsors.filter(s => s.tier !== 'primary');

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-primary)] rounded-3xl">
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-2 bg-[var(--color-accent)]/20 rounded-full border border-[var(--color-accent)]/50 mb-4">
          <p className="text-sm font-semibold text-white">Featured Partner</p>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          Sponsor <span className="text-[var(--color-accent)]">Spotlight</span>
        </h2>
        <p className="text-base text-white/80">Proudly supported by our partners</p>
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
              
              <div className="bg-[var(--color-primary)]/5 rounded-lg p-4 mb-4 border border-[var(--color-primary)]/20">
                <p className="text-[var(--color-dark)] leading-relaxed text-base font-semibold">
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
                  className="flex-1 px-6 py-2 bg-[var(--color-accent)] text-[var(--color-dark)] font-black rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 text-center text-sm uppercase tracking-wider"
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
      <div className="mx-auto mt-12 max-w-2xl text-center">
        <p className="text-base font-semibold leading-7 text-[var(--color-accent)]">Our partners</p>
        <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">All Our Partners</h3>
        <p className="mt-4 text-base sm:text-lg leading-8 text-white/80">
          Thank you to our sponsors and official partners who power the vision of{' '}
          <span className="font-semibold text-[var(--color-accent)]">Chatswood Premier Sports Club</span>.
        </p>
      </div>

      {/* Sponsors Grid */}
      <div className="mt-10 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-5 sm:p-6 md:p-8 space-y-10">
        {/* Primary sponsors (emphasized) */}
        {primarySponsors.length > 0 && (
          <div>
            <div className="mb-5 flex items-center justify-center gap-4">
              <div className="h-px w-10 sm:w-16 bg-white/15" />
              <span className="relative inline-flex items-center overflow-hidden rounded-full bg-[var(--color-accent)]/25 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-white shadow-sm ring-1 ring-inset ring-white/25 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/25 before:to-white/0 before:opacity-70 before:skew-x-12 before:-translate-x-[30%]">
                Proudly Powered By
              </span>
              <div className="h-px w-10 sm:w-16 bg-white/15" />
            </div>

            <div className="grid grid-cols-3 gap-3 md:grid-cols-3 md:gap-6">
              {primarySponsors.map((sponsor, index) => (
                <a
                  key={`${sponsor.name}-primary-${index}`}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ animationDelay: `${index * 90}ms` }}
                  className="partner-card group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  <div className="relative h-20 sm:h-44 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/15 via-white to-[var(--color-accent)]/15" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-6">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-10 sm:max-h-16 md:max-h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute left-2 top-2 hidden sm:inline-flex items-center gap-2 rounded-full bg-white/80 border border-white/60 px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-widest text-[var(--color-dark)]">
                      <span aria-hidden>★</span>
                      {sponsor.role || 'Premier Sponsor'}
                    </div>
                  </div>

                  <div className="p-3 sm:p-6 flex flex-col flex-grow">
                    <p className="text-[0.8rem] sm:text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                      {sponsor.name}
                    </p>

                    {sponsor.description && (
                      <p className="hidden sm:block text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2 flex-grow">
                        {sponsor.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-center gap-2 px-3 py-2 bg-[var(--color-accent)] text-[var(--color-dark)] rounded-lg font-black text-[0.7rem] sm:text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 uppercase tracking-wider w-full">
                      Visit Website →
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Partners */}
        {partnerSponsors.length > 0 && (
          <div>
            <div className="mb-8 mt-2 h-px w-full bg-white/15" />
            <div className="mb-5 flex items-center justify-center gap-4">
              <div className="h-px w-10 sm:w-16 bg-white/15" />
              <span className="relative inline-flex items-center overflow-hidden rounded-full bg-[var(--color-accent)]/25 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-white shadow-sm ring-1 ring-inset ring-white/25 before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/25 before:to-white/0 before:opacity-70 before:skew-x-12 before:-translate-x-[30%]">
                Partners
              </span>
              <div className="h-px w-10 sm:w-16 bg-white/15" />
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {partnerSponsors.map((sponsor, index) => (
                <a
                  key={`${sponsor.name}-partner-${index}`}
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ animationDelay: `${(primarySponsors.length + index) * 70}ms` }}
                  className="partner-card group relative bg-white/90 rounded-2xl p-4 sm:p-6 shadow-sm border border-white/20 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-[var(--color-accent)]/10" />
                  <div className="partner-sheen pointer-events-none absolute -inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors">
                        {sponsor.name}
                      </p>
                      {sponsor.role && (
                        <span className="mt-2 inline-flex items-center rounded-full bg-gray-100/90 text-gray-700 text-[0.7rem] font-semibold px-3 py-1 uppercase tracking-wide">
                          {sponsor.role}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                      Visit →
                    </span>
                  </div>

                  <div className="relative mt-4 flex items-center justify-center bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 min-h-24 flex-1">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="h-12 sm:h-14 w-auto object-contain grayscale-[15%] group-hover:grayscale-0 transition"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
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
          className="inline-block px-10 py-4 bg-[var(--color-accent)] text-[var(--color-dark)] font-black rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 uppercase tracking-wider"
        >
          Explore Sponsorship Opportunities
        </a>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .partner-card {
            animation: none !important;
            transform: none !important;
          }
        }

        .partner-card {
          will-change: transform, opacity;
          animation: partner-fade-up 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        @keyframes partner-fade-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .partner-sheen {
          background: linear-gradient(
            110deg,
            transparent 0%,
            rgba(255, 255, 255, 0.55) 35%,
            transparent 70%
          );
          transform: translateX(-60%);
        }

        .partner-card:hover .partner-sheen {
          animation: partner-sheen 900ms ease-out both;
        }

        @keyframes partner-sheen {
          from {
            transform: translateX(-60%);
          }
          to {
            transform: translateX(60%);
          }
        }
      `}</style>
    </section>
  );
}
