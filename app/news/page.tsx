'use client';

import { useState, useEffect } from 'react';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  date: string;
  image?: string;
  url: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Sports' },
    { id: 'cricket', name: 'Cricket' },
    { id: 'football', name: 'Football' },
    { id: 'basketball', name: 'Basketball' },
    { id: 'tennis', name: 'Tennis' },
  ];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Use mock news data instead of API
      // This provides instant, reliable news display
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      setArticles(getMockNews(selectedCategory));
    } catch (error) {
      console.error('Error loading news:', error);
      setArticles(getMockNews(selectedCategory));
    } finally {
      setLoading(false);
    }
  };

  const getMockNews = (category: string): NewsArticle[] => {
    const mockData: Record<string, NewsArticle[]> = {
      all: [
        {
          id: '1',
          title: 'Cricket Australia Announces Squad for Summer Series',
          description: 'Australia unveils their squad for the upcoming summer cricket series against India. The team includes several young talents alongside experienced players ready for the challenge.',
          source: 'ESPN Cricket',
          category: 'cricket',
          date: '2025-12-24',
          url: 'https://www.espncricinfo.com'
        },
        {
          id: '2',
          title: 'Premier League: Championship Battle Intensifies',
          description: 'Liverpool maintains top position as Manchester City closes the gap. The title race promises to be thrilling this season with multiple contenders fighting for supremacy.',
          source: 'Sky Sports',
          category: 'football',
          date: '2025-12-23',
          url: 'https://www.skysports.com'
        },
        {
          id: '3',
          title: 'NBA Trade Deadline: Major Moves Expected',
          description: 'NBA teams gear up for the trade deadline with several star players rumored to change teams. Expect blockbuster trades in the coming weeks as teams make final adjustments.',
          source: 'ESPN NBA',
          category: 'basketball',
          date: '2025-12-22',
          url: 'https://www.espn.com/nba'
        },
        {
          id: '4',
          title: 'Australian Open Qualifiers Begin',
          description: 'Tennis players compete for spots in the main draw of the Australian Open. Exciting matches showcase emerging talent in the tennis world.',
          source: 'Tennis TV',
          category: 'tennis',
          date: '2025-12-21',
          url: 'https://www.tenisztv.com'
        },
        {
          id: '5',
          title: 'CPSC vs Old Ignatians: Match Preview',
          description: 'CPS Club prepares for an exciting One Day Match against Old Ignatians at Primrose Park. Both teams are in great form and ready for competition.',
          source: 'CPS Club News',
          category: 'cricket',
          date: '2025-12-24',
          url: '#'
        },
        {
          id: '6',
          title: 'World Cup Qualifiers: Drama Unfolds',
          description: 'International football takes center stage as teams battle for World Cup qualification spots. Historic wins and surprising upsets mark this qualification round.',
          source: 'BBC Sport',
          category: 'football',
          date: '2025-12-20',
          url: 'https://www.bbc.com/sport'
        },
      ],
      cricket: [
        {
          id: '1',
          title: 'CPSC vs Old Ignatians: Match Preview',
          description: 'CPS Club prepares for an exciting One Day Match against Old Ignatians at Primrose Park. Both teams are in great form and ready for an intense competition.',
          source: 'CPS Club News',
          category: 'cricket',
          date: '2025-12-24',
          url: '#'
        },
        {
          id: '2',
          title: 'Cricket Australia Announces Squad for Summer Series',
          description: 'Australia unveils their squad for the upcoming summer cricket series. The team includes several young talents and experienced professionals.',
          source: 'ESPN Cricket',
          category: 'cricket',
          date: '2025-12-23',
          url: 'https://www.espncricinfo.com'
        },
        {
          id: '3',
          title: 'IPL 2026: Franchise Preparations Begin',
          description: 'Indian Premier League franchises begin preparations for the 2026 season. Exciting player auctions and team building activities are underway.',
          source: 'Cricbuzz',
          category: 'cricket',
          date: '2025-12-22',
          url: 'https://www.cricbuzz.com'
        },
        {
          id: '4',
          title: 'Test Cricket: West Indies Tour Announced',
          description: 'West Indies cricket team announces their tour schedule for the upcoming season. Multiple test matches against top international teams are planned.',
          source: 'ICC Cricket',
          category: 'cricket',
          date: '2025-12-21',
          url: 'https://www.icc-cricket.com'
        },
        {
          id: '5',
          title: 'Women\'s Cricket: Championship Starts',
          description: 'Women\'s cricket championship kicks off with exciting matches between international teams. Rising stars showcase their talents on the global stage.',
          source: 'Women\'s Cricket',
          category: 'cricket',
          date: '2025-12-20',
          url: 'https://www.womenscricket.com'
        },
        {
          id: '6',
          title: 'T20 World League: Format Changes Announced',
          description: 'ICC announces significant format changes for the upcoming T20 World League. New rules aim to make the game more exciting for fans worldwide.',
          source: 'ICC Official',
          category: 'cricket',
          date: '2025-12-19',
          url: 'https://www.icc-cricket.com'
        },
      ],
      football: [
        {
          id: '1',
          title: 'Premier League: Championship Battle Intensifies',
          description: 'Liverpool maintains top position as Manchester City closes the gap. The title race promises to be thrilling with multiple strong contenders.',
          source: 'Sky Sports',
          category: 'football',
          date: '2025-12-23',
          url: 'https://www.skysports.com'
        },
        {
          id: '2',
          title: 'World Cup Qualifiers: Drama Unfolds',
          description: 'International football takes center stage as teams battle for World Cup qualification. Historic wins and surprising upsets mark this qualification round.',
          source: 'BBC Sport',
          category: 'football',
          date: '2025-12-20',
          url: 'https://www.bbc.com/sport'
        },
        {
          id: '3',
          title: 'Champions League: Quarter-Finals Draw',
          description: 'Champions League quarter-finals draw sets up exciting matchups. Top European clubs face off in what promises to be thrilling encounters.',
          source: 'UEFA Official',
          category: 'football',
          date: '2025-12-18',
          url: 'https://www.uefa.com'
        },
        {
          id: '4',
          title: 'Transfer Market: January Window Opens',
          description: 'Football transfer market heats up as clubs prepare for January signings. Major transfers and loan deals are expected across Europe.',
          source: 'Transfermarkt',
          category: 'football',
          date: '2025-12-17',
          url: 'https://www.transfermarkt.com'
        },
        {
          id: '5',
          title: 'Euro 2024: Team Preparations Begin',
          description: 'National teams begin preparations for the upcoming Euro championship. Friendlies and training camps provide valuable preparation time.',
          source: 'ESPN Football',
          category: 'football',
          date: '2025-12-16',
          url: 'https://www.espn.com/soccer'
        },
        {
          id: '6',
          title: 'La Liga: Real Madrid on Top Form',
          description: 'Real Madrid continues their winning streak in La Liga. Impressive performances keep them ahead in the Spanish championship race.',
          source: 'Marca',
          category: 'football',
          date: '2025-12-15',
          url: 'https://www.marca.com'
        },
      ],
      basketball: [
        {
          id: '1',
          title: 'NBA Trade Deadline: Major Moves Expected',
          description: 'NBA teams gear up for the trade deadline with several star players rumored to change teams. Blockbuster trades expected in coming weeks.',
          source: 'ESPN NBA',
          category: 'basketball',
          date: '2025-12-22',
          url: 'https://www.espn.com/nba'
        },
        {
          id: '2',
          title: 'NBA Finals Preview: Championship Contenders',
          description: 'Top NBA teams prepare for the finals. Intense competition as franchises battle for the championship trophy.',
          source: 'NBA Official',
          category: 'basketball',
          date: '2025-12-21',
          url: 'https://www.nba.com'
        },
        {
          id: '3',
          title: 'Rookie Class 2025: Rising Stars Impress',
          description: 'The 2025 NBA rookie class continues to impress fans and experts. Young talents showcase their potential in the league.',
          source: 'Sports Illustrated',
          category: 'basketball',
          date: '2025-12-20',
          url: 'https://www.si.com'
        },
        {
          id: '4',
          title: 'All-Star Game: Fan Voting Begins',
          description: 'NBA All-Star game voting begins with fans choosing their favorite players. Excitement builds for the annual showcase event.',
          source: 'NBA.com',
          category: 'basketball',
          date: '2025-12-19',
          url: 'https://www.nba.com'
        },
        {
          id: '5',
          title: 'College Basketball: March Madness Approaches',
          description: 'College basketball season heats up as teams position themselves for March Madness. Exciting matchups determine tournament seeding.',
          source: 'ESPN College',
          category: 'basketball',
          date: '2025-12-18',
          url: 'https://www.espn.com/mens-college-basketball'
        },
        {
          id: '6',
          title: 'EuroLeague: European Teams Dominate',
          description: 'European basketball leagues showcase top talent from around the continent. Competitive matches draw passionate fan bases.',
          source: 'EuroLeague Official',
          category: 'basketball',
          date: '2025-12-17',
          url: 'https://www.euroleague.net'
        },
      ],
      tennis: [
        {
          id: '1',
          title: 'Australian Open Qualifiers Begin',
          description: 'Tennis players compete for spots in the main draw of the Australian Open. Exciting matches showcase emerging talent in the sport.',
          source: 'Tennis TV',
          category: 'tennis',
          date: '2025-12-21',
          url: 'https://www.australianopen.com'
        },
        {
          id: '2',
          title: 'Wimbledon 2026: Preparations Underway',
          description: 'Wimbledon Championship begins preparations for 2026. Historic grass courts of the All England Club await the world\'s best players.',
          source: 'Wimbledon Official',
          category: 'tennis',
          date: '2025-12-20',
          url: 'https://www.wimbledon.com'
        },
        {
          id: '3',
          title: 'ATP Tour: Finals Update',
          description: 'ATP tour provides exciting matches as players compete for ranking points. Top seeds battle for supremacy in men\'s tennis.',
          source: 'ATP Official',
          category: 'tennis',
          date: '2025-12-19',
          url: 'https://www.atptour.com'
        },
        {
          id: '4',
          title: 'WTA Tour: Women\'s Tennis Highlights',
          description: 'Women\'s tennis showcases incredible talent and athleticism. WTA tour delivers exciting matches throughout the season.',
          source: 'WTA Official',
          category: 'tennis',
          date: '2025-12-18',
          url: 'https://www.wtatennis.com'
        },
        {
          id: '5',
          title: 'US Open: Recap and Analysis',
          description: 'US Open concludes with thrilling finals. Champions emerge from two weeks of intense competition on hard courts.',
          source: 'ESPN Tennis',
          category: 'tennis',
          date: '2025-12-17',
          url: 'https://www.usopen.org'
        },
        {
          id: '6',
          title: 'French Open: Upcoming Qualifiers',
          description: 'French Open qualifiers determine who will compete in the main draw. Clay court specialists shine in this prestigious event.',
          source: 'Roland Garros',
          category: 'tennis',
          date: '2025-12-16',
          url: 'https://www.rolandgarros.com'
        },
      ]
    };

    return mockData[category] || mockData['all'];
  };

  return (
    <main className="min-h-screen bg-blue-100 pt-32 pb-20">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 mb-16">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-[var(--color-primary-2)]/10 rounded-full border border-[var(--color-primary-2)] mb-6">
            <p className="text-sm font-semibold text-[var(--color-primary-2)]">Sports Updates</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-dark)] mb-6 leading-tight">
            Sports <span className="text-[var(--color-primary)]">News</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest sports news from around the world
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white shadow-lg scale-105'
                  : 'bg-white text-[var(--color-dark)] border-2 border-gray-200 hover:border-[var(--color-primary)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* News Grid */}
      <section className="mx-auto max-w-7xl px-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-primary)]"></div>
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target={article.url === '#' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="group cursor-pointer"
              >
                <article
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex border border-gray-200 hover:border-[var(--color-primary)]"
                >
                  {/* Image placeholder */}
                  <div className="w-48 h-32 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-2)]/20 flex-shrink-0 flex items-center justify-center group-hover:from-[var(--color-primary)]/30 group-hover:to-[var(--color-primary-2)]/30 transition-all">
                    <span className="text-4xl">📰</span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    {/* Top section */}
                    <div>
                      {/* Category and Date */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 bg-[var(--color-primary)]/10 rounded text-xs font-bold text-[var(--color-primary)]">
                          {article.category.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">{article.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-[var(--color-dark)] mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {article.description}
                      </p>
                    </div>

                    {/* Source */}
                    <div className="pt-3 border-t border-gray-100 mt-2 flex items-center justify-between">
                      <p className="text-xs font-semibold text-[var(--color-primary-2)]">
                        {article.source}
                      </p>
                      <span className="text-xs font-bold text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">
                        Read →
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No news available for this category</p>
          </div>
        )}
      </section>
    </main>
  );
}
