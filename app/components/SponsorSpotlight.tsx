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
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-2 bg-[var(--color-primary-2)]/10 rounded-full border border-[var(--color-primary-2)] mb-6">
          <p className="text-sm font-semibold text-[var(--color-primary-2)]">Featured Partner</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-dark)] mb-4">
          Sponsor <span className="text-[var(--color-primary)]">Spotlight</span>
        </h2>
        <p className="text-lg text-gray-600">Proudly supported by our amazing partners</p>
      </div>

      {/* Main Carousel */}
      <div className="relative mb-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Logo/Image Side */}
            <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 min-h-64">
              <div className="text-center">
                <img 
                  src={currentSponsor.logo || "/images/sponsors/default.png"} 
                  alt={currentSponsor.name}
                  className="h-32 w-auto mx-auto object-contain mb-4"
                />
                <p className="text-2xl font-bold text-[var(--color-dark)]">
                  {currentSponsor.name}
                </p>
              </div>
            </div>

            {/* Info Side */}
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-[var(--color-dark)] mb-4">
                {currentSponsor.name}
              </h3>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
                <p className="text-gray-700 leading-relaxed text-lg font-medium">
                  "{currentSponsor.description}"
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  <p className="text-gray-700">Premium sponsorship package included</p>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  <p className="text-gray-700">Featured in all marketing materials</p>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-3"></span>
                  <p className="text-gray-700">Exclusive networking events</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={currentSponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
                >
                  Visit Website
                </a>
                <a 
                  href="/sponsorship"
                  className="flex-1 px-6 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 text-center"
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
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:translate-x-0 md:left-4 bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] p-3 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 z-10"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-0 md:right-4 bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] p-3 rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 z-10"
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
                ? 'bg-[var(--color-primary)] w-8'
                : 'bg-gray-300 w-3 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Sponsor Grid - Show All */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-8">
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
      <div className="mt-16 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-2)]/10 rounded-2xl p-12 text-center border-2 border-dashed border-[var(--color-primary)]">
        <h3 className="text-3xl font-bold text-[var(--color-dark)] mb-4">
          Want to Become a Sponsor?
        </h3>
        <p className="text-gray-700 mb-8 text-lg max-w-2xl mx-auto">
          Join our growing network of sponsors and gain exposure to thousands of cricket fans. 
          Perfect for local businesses looking to grow their brand!
        </p>
        <a 
          href="/sponsorship"
          className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Explore Sponsorship Opportunities
        </a>
      </div>
    </section>
  );
}
