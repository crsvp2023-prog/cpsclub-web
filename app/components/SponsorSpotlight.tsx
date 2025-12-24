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
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-8">
          All Our Partners
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {sponsors.map((sponsor, index) => (
          <a
            key={index}
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg hover:scale-105 hover:border-[var(--color-primary)] transition-all duration-300 flex flex-col items-center justify-center min-h-32 group cursor-pointer"
          >
            <img 
              src={sponsor.logo} 
              alt={sponsor.name}
              className="h-20 w-auto object-contain mb-3 group-hover:scale-110 transition-transform duration-300"
            />
            <p className="text-sm font-semibold text-center text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors">
              {sponsor.name}
            </p>
            <p className="text-xs text-[var(--color-primary)] font-semibold opacity-0 group-hover:opacity-100 transition-opacity mt-2">
              Visit →
            </p>
          </a>
        ))}
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
    </section>
  );
}
