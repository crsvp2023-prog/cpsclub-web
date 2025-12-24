'use client';

import { useState, useEffect } from 'react';

export default function InstagramFeed() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="instagram-feed" className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <a href="https://www.instagram.com/chatswoodpremiersportsclub/" target="_blank" rel="noopener noreferrer" className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full border border-purple-300 hover:bg-purple-200 hover:border-purple-400 transition-all duration-300 cursor-pointer">
            <p className="text-sm font-semibold text-purple-700">📸 Follow Us</p>
          </a>
          <h2 className="text-5xl font-extrabold text-[var(--color-dark)] mb-3">
            Instagram Feed
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            📱 Follow on Instagram
            <span>→</span>
          </a>
        </div>

        {/* Accent line */}
        <div className="mt-16 h-1 w-32 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full" />
      </div>
    </section>
  );
}
