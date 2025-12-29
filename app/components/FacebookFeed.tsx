'use client';

import { useEffect, useState } from 'react';

export default function FacebookFeed() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Reload Facebook SDK after component mounts
    if (typeof window !== 'undefined' && (window as any).FB) {
      (window as any).FB.XFBML.parse();
    }
  }, []);

  return (
    <section id="facebook-feed" className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full border border-blue-300">
            <p className="text-sm font-semibold text-blue-700">👥 Community</p>
          </div>
          <h2 className="text-5xl font-extrabold text-[var(--color-dark)] mb-3">
            Facebook Community
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join our community and stay updated with all the latest news
          </p>
        </div>

        {/* Facebook Feed Container */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {/* Facebook Page Plugin */}
            {mounted && (
              <div
                suppressHydrationWarning
                className="fb-page rounded-xl shadow-xl overflow-hidden"
                data-href="https://www.facebook.com/chatswood.premier.sports.club"
                data-tabs="timeline"
                data-width="500"
                data-height="600"
                data-small-header="false"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true"
              />
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <a
            href="https://www.facebook.com/chatswood.premier.sports.club"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-100 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-blue-600"
          >
            👍 Like Us on Facebook
            <span>→</span>
          </a>
        </div>

        {/* Accent line */}
        <div className="mt-16 h-1 w-32 mx-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-full" />
      </div>
    </section>
  );
}
