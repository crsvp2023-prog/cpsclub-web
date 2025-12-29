'use client';

import { useState, useEffect } from 'react';

export default function SocialFeeds() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-[#0066FF] via-[#0052CC] to-[#003B82] border-t border-[var(--color-accent)]/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 animate-fadeInDown">
            Connect With Us
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto animate-fadeInUp">
            Follow us on social media for updates, highlights, and community news.
          </p>
        </div>

        {/* Social Feeds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
          {/* Instagram Feed */}
          <div className="bg-slate-800/40 backdrop-blur rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">📱 Instagram</h3>
              <p className="text-gray-300 text-sm">Latest posts and stories</p>
            </div>
            {mounted && (
              <div className="mb-6 flex justify-center">
                <iframe
                  src="https://www.instagram.com/chatswoodpremiersportsclub/embed"
                  width="100%"
                  height="400"
                  style={{ border: 'none', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}
                  allow="encrypted-media"
                />
              </div>
            )}
            <div className="text-center">
              <a
                href="https://www.instagram.com/chatswoodpremiersportsclub/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-[#F77737]"
              >
                Follow on Instagram
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Facebook Feed */}
          <div className="bg-slate-800/40 backdrop-blur rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">👍 Facebook</h3>
              <p className="text-gray-300 text-sm">Community updates and events</p>
            </div>
            {mounted && (
              <div className="mb-6 flex justify-center">
                <div
                  className="fb-page"
                  data-href="https://www.facebook.com/chatswood.premier.sports.club"
                  data-tabs="timeline"
                  data-width="100%"
                  data-height="400"
                  data-small-header="false"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="true"
                />
              </div>
            )}
            <div className="text-center">
              <a
                href="https://www.facebook.com/chatswood.premier.sports.club"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-100 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-blue-600"
              >
                Like us on Facebook
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out 0.2s backwards;
        }
      `}</style>
    </section>
  );
}
