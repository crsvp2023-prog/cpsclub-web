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
    { href: '/news', label: 'Blogs' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 shadow-md`} style={{ backgroundColor: '#003B82' }}>
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: '#FFB81C' }}></div>

      {/* Main Header */}
      <div className="w-full">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 py-1.5 sm:py-3 flex justify-between items-center gap-1 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 min-w-fit">
            <Image 
              src="/images/cpsclub-logo.png" 
              alt="CPS Club Logo" 
              width={40} 
              height={40} 
              className="rounded-sm object-contain w-7 h-7 sm:w-[45px] sm:h-[45px]"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-sm sm:text-base font-bold text-white leading-tight" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.4px' }}>CPSC</h1>
              <p className="text-[9px] sm:text-xs text-[#FFB81C] font-bold leading-tight" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.2px' }}>ONE TEAM, ONE DREAM</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs lg:text-sm flex-1 justify-center">
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
            className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
            style={{ color: '#FFB81C' }}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-current block transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-current block transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-current block transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 animate-in fade-in slide-in-from-top-2 duration-200" style={{ backgroundColor: '#003B82' }}>
            <nav className="flex flex-col gap-0 px-0 py-0">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-4 px-4 font-semibold transition-all duration-300 uppercase tracking-wider text-xs block border-l-4 hover:bg-white/10 ${
                    currentPath === link.href ? 'border-l-[#FFD100] bg-white/5' : 'border-l-transparent'
                  }`}
                  style={{ 
                    color: currentPath === link.href ? '#FFD100' : '#ffffff',
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div className="px-4 py-3 border-t border-white/20">
                <a
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 font-semibold rounded transition-all duration-300 uppercase tracking-wider text-xs block text-center hover:shadow-lg hover:scale-105"
                  style={{ 
                    backgroundColor: '#FFD100',
                    color: '#00215d',
                    fontFamily: 'Arial, sans-serif'
                  }}
                >
                  Login
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
