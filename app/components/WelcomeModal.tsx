'use client';

import { useState, useEffect } from 'react';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal after a short delay (500ms) to avoid jarring appearance
    const timer = setTimeout(() => {
      // Check if user has dismissed this session
      if (!sessionStorage.getItem('welcomeModalDismissed')) {
        setIsOpen(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('welcomeModalDismissed', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-[var(--color-dark)] rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Welcome Video Content */}
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">🏏</div>
            <h2 className="text-3xl font-black" style={{ fontFamily: 'Arial, sans-serif' }}>
              Welcome!
            </h2>
          </div>
          <p className="text-white/90 font-semibold" style={{ fontFamily: 'Arial, sans-serif' }}>
            Welcome to Chatswood Premier Sports Club
          </p>
        </div>

        {/* Video Container */}
        <div className="aspect-video bg-black">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/jZ3JNcJqifA?autoplay=1&rel=0"
            title="Welcome to Chatswood Premier Sports Club"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
            One Team, One Dream
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed" style={{ fontFamily: 'Arial, sans-serif' }}>
            Join us at Chatswood Premier Sports Club, where passion for cricket meets community spirit. We're dedicated to fostering physical fitness, unity, and excellence in everything we do.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/register"
              className="flex-1 px-6 py-3 bg-[var(--color-accent)] text-[var(--color-dark)] rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              Register Interest
            </a>
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-300 transition-all duration-300"
              style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.1em' }}
            >
              Explore More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
