'use client';

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
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

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 shadow-md`} style={{ backgroundColor: '#003B82' }}>
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: '#FFB81C' }}></div>

      {/* Main Header */}
      <div className="w-full">
        <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Image 
              src="/images/cpsclub-logo.png" 
              alt="CPS Club Logo" 
              width={50} 
              height={50} 
              className="rounded-sm object-contain"
            />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-white" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.5px' }}>CPS CLUB</h1>
              <p className="text-xs text-[#FFB81C] font-bold" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.3px' }}>ONE TEAM, ONE DREAM</p>
            </div>
          </div>

          {/* Navigation - Spread across center */}
          <nav className="flex items-center gap-8 text-xs flex-1 justify-center">
            <a 
              href="/" 
              className={`pb-2 font-semibold transition-all duration-300 uppercase tracking-wider ${
                currentPath === '/' ? 'border-b-2' : ''
              }`}
              style={{ 
                color: currentPath === '/' ? '#FFD100' : '#ffffff',
                borderColor: currentPath === '/' ? '#FFD100' : 'transparent',
                fontFamily: 'Arial, sans-serif'
              }}
            >
              Home
            </a>
            <a 
              href="/about" 
              className={`pb-2 font-semibold transition-all duration-300 uppercase tracking-wider ${
                currentPath === '/about' ? 'border-b-2' : ''
              }`}
              style={{ 
                color: currentPath === '/about' ? '#FFD100' : '#ffffff',
                borderColor: currentPath === '/about' ? '#FFD100' : 'transparent',
                fontFamily: 'Arial, sans-serif'
              }}
            >
              About
            </a>
            <a 
              href="/gallery" 
              className={`pb-2 font-semibold transition-all duration-300 uppercase tracking-wider ${
                currentPath === '/gallery' ? 'border-b-2' : ''
              }`}
              style={{ 
                color: currentPath === '/gallery' ? '#FFD100' : '#ffffff',
                borderColor: currentPath === '/gallery' ? '#FFD100' : 'transparent',
                fontFamily: 'Arial, sans-serif'
              }}
            >
              Gallery
            </a>
            <a 
              href="/events" 
              className={`pb-2 font-semibold transition-all duration-300 uppercase tracking-wider ${
                currentPath === '/events' ? 'border-b-2' : ''
              }`}
              style={{ 
                color: currentPath === '/events' ? '#FFD100' : '#ffffff',
                borderColor: currentPath === '/events' ? '#FFD100' : 'transparent',
                fontFamily: 'Arial, sans-serif'
              }}
            >
              Events
            </a>
            <a 
              href="/scores" 
              className={`pb-2 font-semibold transition-all duration-300 uppercase tracking-wider ${
                currentPath === '/scores' ? 'border-b-2' : ''
              }`}
              style={{ 
                color: currentPath === '/scores' ? '#FFD100' : '#ffffff',
                borderColor: currentPath === '/scores' ? '#FFD100' : 'transparent',
                fontFamily: 'Arial, sans-serif'
              }}
            >
              Scores
            </a>
            <a 
              href="/contact" 
              className={`pb-2 font-semibold transition-all duration-300 uppercase tracking-wider ${
                currentPath === '/contact' ? 'border-b-2' : ''
              }`}
              style={{ 
                color: currentPath === '/contact' ? '#FFD100' : '#ffffff',
                borderColor: currentPath === '/contact' ? '#FFD100' : 'transparent',
                fontFamily: 'Arial, sans-serif'
              }}
            >
              Contact
            </a>
          </nav>

          {/* Login Button */}
          <a
            href="/login"
            className="px-7 py-2.5 font-semibold rounded hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap flex-shrink-0 text-xs uppercase tracking-wider"
            style={{ 
              backgroundColor: '#FFD100',
              color: '#00215d',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
}
