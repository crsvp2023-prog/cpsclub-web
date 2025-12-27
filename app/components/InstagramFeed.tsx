'use client';

import { useState, useEffect } from 'react';

export default function InstagramFeed() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="instagram-feed" className="bg-gradient-to-br from-[#F77737] via-[#FD1D1D] to-[#833AB4] py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#833AB4] rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F77737] rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <a href="https://www.instagram.com/chatswoodpremiersportsclub/" target="_blank" rel="noopener noreferrer" className="inline-block mb-4 px-4 py-2 bg-white/20 rounded-full border border-white/50 hover:bg-white/30 transition-all duration-300 cursor-pointer backdrop-blur">
            <p className="text-sm font-semibold text-white">📸 Follow Us</p>
          </a>
          <h2 className="text-5xl font-extrabold text-white mb-3">
            Instagram Feed
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
            Stay connected with our latest moments and updates
          </p>
        </div>

        {/* Instagram Embed Container */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {/* Instagram Feed Widget */}
            {mounted && (
              <iframe
                src="https://www.instagram.com/chatswoodpremiersportsclub/embed"
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
                className="rounded-xl shadow-xl"
                style={{ border: 'none' }}
              />
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/chatswoodpremiersportsclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-transparent bg-gradient-to-r from-[#F77737] via-[#FD1D1D] to-[#833AB4] bg-clip-text font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ring-2 ring-white/50 rounded-full hover:ring-white"
          >
            📱 Follow on Instagram
            <span>→</span>
          </a>
        </div>

        {/* Accent line */}
        <div className="mt-16 h-1 w-32 mx-auto bg-gradient-to-r from-white/80 via-white/60 to-white/80 rounded-full" />
      </div>
    </section>
  );
}
