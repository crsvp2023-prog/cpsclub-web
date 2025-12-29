'use client';

import { useState, useEffect } from 'react';
import FacebookFeed from './FacebookFeed';

export default function SocialFeeds() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Initialize Facebook XFBML parser with retry logic
    let retries = 0;
    const initFacebook = () => {
      if ((window as any).FB) {
        (window as any).FB.XFBML.parse();
        console.log('✓ Facebook SDK parsed');
      } else if (retries < 5) {
        retries++;
        setTimeout(initFacebook, 300);
      }
    };

    // Initialize Instagram embeds
    const initInstagram = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
        console.log('✓ Instagram embeds processed');
      }
    };

    // Start initialization after brief delay
    const timer = setTimeout(() => {
      initFacebook();
      initInstagram();
    }, 800);
    
    return () => clearTimeout(timer);
  }, [mounted]);

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
              <p className="text-sm text-[#F77737] font-semibold mb-1">@chatswoodpremiersportsclub</p>
              <p className="text-gray-300 text-sm">Latest posts and stories</p>
            </div>
            {mounted && (
              <div className="mb-6 flex justify-center">
                <blockquote 
                  className="instagram-media" 
                  data-instgrm-permalink="https://www.instagram.com/chatswoodpremiersportsclub/" 
                  data-instgrm-version="14"
                  style={{
                    background: '#FFF',
                    border: '0',
                    borderRadius: '3px',
                    boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                    margin: '1px',
                    maxWidth: '540px',
                    minWidth: '326px',
                    padding: '0',
                    width: '100%',
                  }}
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
              <p className="text-sm text-blue-400 font-semibold mb-1">chatswood.premier.sports.club</p>
              <p className="text-gray-300 text-sm">Community updates and events</p>
            </div>
            <div className="mb-6">
              <FacebookFeed />
            </div>
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
