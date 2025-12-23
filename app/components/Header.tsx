'use client';

import Image from "next/image";
import { useState, useEffect } from "react";

const newsItems = [
  { id: 1, title: "� BBL Season 15 - Cricket Australia announces exciting new matches for 2025-2026", badge: "LIVE" },
  { id: 2, title: "🦘 Australia vs New Zealand - Summer series kicks off with thrilling encounters", badge: "UPCOMING" },
  { id: 3, title: "🌟 Sheffield Shield continues - State cricket reaches critical stages", badge: "IN PROGRESS" },
  { id: 4, title: "🎯 Australian Men's ODI Squad - New selections announced for international fixtures", badge: "LATEST" },
  { id: 5, title: "👩‍🦰 Women's T20 World Cup Qualifiers - Aussie women chase glory on world stage", badge: "BREAKING" }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000); // Change news every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-lg transition-all duration-300">
      {/* News Ticker */}
      <div className="bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-primary-2)] to-[var(--color-accent)] px-6 py-2">
        <div className="mx-auto max-w-7xl flex items-center gap-4">
          <span className="font-black text-white text-sm uppercase tracking-wide">📰 News</span>
          <div className="flex-1 overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{
              transform: `translateX(-${currentNewsIndex * 100}%)`
            }}>
              {newsItems.map((item) => (
                <div key={item.id} className="min-w-full flex items-center gap-3 whitespace-nowrap">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <span className="px-2 py-1 bg-white/20 text-white text-xs font-bold rounded-full">{item.badge}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-1">
            {newsItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentNewsIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentNewsIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="h-1 w-full bg-[var(--color-primary-2)]" />
      <div className={`mx-auto max-w-7xl px-6 py-3 flex justify-between items-center transition-all duration-300 ${
        isScrolled 
          ? 'bg-[var(--color-dark)]' 
          : 'bg-gradient-to-b from-[var(--color-dark)] to-[rgba(1,44,90,0.85)]'
      }`}>
        <div className="flex items-center gap-3">
          <Image src="/images/cpsclub-logo.png" alt="CPS Club Logo" width={48} height={48} className="rounded-sm object-contain" />
          <h1 className="text-xl font-bold text-white">CPS Club</h1>
        </div>

        <nav className="space-x-6 text-sm font-medium">
          <a 
            href="/" 
            className={`relative pb-2 font-bold transition-all duration-300 ${
              currentPath === '/' 
                ? 'text-[var(--color-accent)]' 
                : 'text-white hover:text-[var(--color-accent)]'
            }`}
          >
            Home
            {currentPath === '/' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary-2)]"></div>
            )}
          </a>
          <a 
            href="/about" 
            className={`relative pb-2 font-bold transition-all duration-300 ${
              currentPath === '/about' 
                ? 'text-[var(--color-accent)]' 
                : 'text-white hover:text-[var(--color-accent)]'
            }`}
          >
            About
            {currentPath === '/about' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary-2)]"></div>
            )}
          </a>
          <a 
            href="/gallery" 
            className={`relative pb-2 font-bold transition-all duration-300 ${
              currentPath === '/gallery' 
                ? 'text-[var(--color-accent)]' 
                : 'text-white hover:text-[var(--color-accent)]'
            }`}
          >
            Gallery
            {currentPath === '/gallery' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary-2)]"></div>
            )}
          </a>
          <a 
            href="/events" 
            className={`relative pb-2 font-bold transition-all duration-300 ${
              currentPath === '/events' 
                ? 'text-[var(--color-accent)]' 
                : 'text-white hover:text-[var(--color-accent)]'
            }`}
          >
            Events
            {currentPath === '/events' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary-2)]"></div>
            )}
          </a>
          <a 
            href="/scores" 
            className={`relative pb-2 font-bold transition-all duration-300 ${
              currentPath === '/scores' 
                ? 'text-[var(--color-accent)]' 
                : 'text-white hover:text-[var(--color-accent)]'
            }`}
          >
            Scores
            {currentPath === '/scores' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary-2)]"></div>
            )}
          </a>
          <a 
            href="/contact" 
            className={`relative pb-2 font-bold transition-all duration-300 ${
              currentPath === '/contact' 
                ? 'text-[var(--color-accent)]' 
                : 'text-white hover:text-[var(--color-accent)]'
            }`}
          >
            Contact
            {currentPath === '/contact' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary-2)]"></div>
            )}
          </a>
        </nav>
      </div>
    </header>
  );
}
