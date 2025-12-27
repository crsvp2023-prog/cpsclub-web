'use client';

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/events', label: 'Events' },
    { href: '/scores', label: 'Scores' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 shadow-md`} style={{ backgroundColor: '#003B82' }}>
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: '#FFB81C' }}></div>

      {/* Main Header */}
      <div className="w-full">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2 sm:py-4 flex justify-between items-center gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Image 
              src="/images/cpsclub-logo.png" 
              alt="CPS Club Logo" 
              width={40} 
              height={40} 
              className="rounded-sm object-contain w-8 h-8 sm:w-[50px] sm:h-[50px]"
            />
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-lg font-semibold text-white" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.5px' }}>CPS CLUB</h1>
              <p className="text-xs text-[#FFB81C] font-bold" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.3px' }}>ONE TEAM, ONE DREAM</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm flex-1 justify-center">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className={`pb-2 font-semibold transition-all duration-300 uppercase tracking-wider ${
                  currentPath === link.href ? 'border-b-2' : ''
                }`}
                style={{ 
                  color: currentPath === link.href ? '#FFD100' : '#ffffff',
                  borderColor: currentPath === link.href ? '#FFD100' : 'transparent',
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Login Button - Desktop */}
          <a
            href="/login"
            className="hidden sm:inline-flex px-4 sm:px-7 py-2 sm:py-2.5 font-semibold rounded hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap flex-shrink-0 text-xs uppercase tracking-wider"
            style={{ 
              backgroundColor: '#FFD100',
              color: '#00215d',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            Login
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col gap-1 p-2 -mr-2 touch-target"
            style={{ color: '#FFB81C' }}
            aria-label="Toggle menu"
          >
            <span className="w-6 h-0.5 bg-current block transition-all"></span>
            <span className="w-6 h-0.5 bg-current block transition-all"></span>
            <span className="w-6 h-0.5 bg-current block transition-all"></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 max-h-[calc(100vh-60px)] overflow-y-auto" style={{ backgroundColor: '#003B82' }}>
            <nav className="flex flex-col gap-0 px-3 py-2">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-3 px-3 font-semibold transition-all duration-300 uppercase tracking-wider text-xs block border-l-4 ${
                    currentPath === link.href ? 'border-l-[#FFD100]' : 'border-l-transparent'
                  }`}
                  style={{ 
                    color: currentPath === link.href ? '#FFD100' : '#ffffff',
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-3 font-semibold rounded transition-all duration-300 uppercase tracking-wider text-xs mt-2 text-center"
                style={{ 
                  backgroundColor: '#FFD100',
                  color: '#00215d',
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                Login
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
