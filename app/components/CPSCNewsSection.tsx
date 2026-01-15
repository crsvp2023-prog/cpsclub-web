'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  source: string;
  image?: string;
  category?: string;
}

export default function CPSCNewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCPSCNews();
  }, []);

  const loadCPSCNews = async () => {
    try {
      // Load from Firebase sports news data
      const response = await fetch('/sports-news-data.json');
      if (response.ok) {
        const data = await response.json();
        if (data.news && Array.isArray(data.news)) {
          // Filter to show only sports category (CPSC News)
          const cpscNews = data.news.filter((item: any) => item.category === 'sports');
          setNews(cpscNews.slice(0, 3)); // Show only first 3
        }
      }
    } catch (error) {
      console.error('Error loading CPSC news:', error);
      // Fallback to mock data if fetch fails
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'CPSC-A VS TROOPERS',
          description: 'In a thrilling match between CPSC and Troopers, CPSC won the toss and elected to field first. With an excellent start from bowlers Vishal and Harry, CPSC got an early wicket and a spectacular catch by Harry at point. CPSC sealed the deal with a win by 6 wickets, concluding the innings by 2:55 PM.',
          date: '2025-12-29',
          source: 'CPSC Club News',
          image: '🏏'
        },
      ];
      setNews(mockNews);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[var(--color-primary)] mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-block mb-3 sm:mb-4 px-3 py-1 bg-[var(--color-primary)]/20 rounded-full border border-[var(--color-primary)]/40">
            <p className="text-xs sm:text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wide">📢 Latest Updates</p>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
            CPSC <span className="text-[var(--color-primary)]">News</span>
          </h2>
          
          <p className="text-gray-600 text-sm sm:text-base">Stay updated with the latest news and announcements from CPSC</p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {news.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[var(--color-primary)] flex flex-col"
            >
              {/* Image/Icon Section */}
              <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-2)]/10 flex items-center justify-center group-hover:from-[var(--color-primary)]/20 group-hover:to-[var(--color-primary-2)]/20 transition-all">
                <span className="text-5xl sm:text-6xl">{item.image || '📝'}</span>
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                {/* Date and Source */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-xs font-semibold text-gray-500">{item.date}</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded">
                    {item.source}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {item.description}
                </p>

                {/* CTA Button */}
                <button className="px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 text-sm">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/news?category=sports">
            <button className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
              View All News →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
