'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      // Parse the ID: format is "prefix-id"
      const hyphenIndex = id.indexOf('-');
      const prefix = id.substring(0, hyphenIndex);
      const cleanId = id.substring(hyphenIndex + 1);

      // If it's a CPSC or sports article, try Firebase first
      if (prefix === 'cpsc' || prefix === 'sports') {
        try {
          // Dynamically import Firebase to avoid SSR issues
          const { dbTest } = await import('../../lib/firebase');
          const { collection, getDocs, query, where } = await import('firebase/firestore');
          
          const cpscNewsRef = collection(dbTest, 'cpsc-news');
          const q = query(cpscNewsRef, where('id', '==', cleanId));
          const snapshot = await getDocs(q);
          
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const data = doc.data();
            setArticle({ 
              ...data as NewsArticle, 
              id: id, 
              category: 'sports' 
            });
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log('Firebase fetch failed, using fallback:', error);
          // Fall through to fallback data
        }
      }

      // For CPSC/sports articles, look in the 'sports' category of mock data
      const categoryForLookup = (prefix === 'cpsc' || prefix === 'sports') ? 'sports' : prefix;
      const allMockData = getArticlesByCategory(categoryForLookup);
      const foundArticle = allMockData.find(a => a.id === cleanId);
      
      if (foundArticle) {
        // If the article has a valid external URL and it's not an internal link, redirect to it in a new tab
        if (foundArticle.url && foundArticle.url !== '#' && !foundArticle.url.startsWith('/')) {
          window.open(foundArticle.url, '_blank');
          // Redirect back to news page in current tab
          window.location.href = '/news';
          return;
        }
        setArticle({ ...foundArticle, id: id });
      } else {
        console.error('Article not found - Prefix:', prefix, 'ID:', cleanId);
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const getArticlesByCategory = (category: string) => {
    const allArticles: NewsArticle[] = [
      // Cricket
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
        source: 'Cricket.com.au',
        category: 'cricket',
        date: '2025-12-23',
        url: 'https://www.cricket.com.au/news'
      },
      {
        id: '3',
        title: 'IPL 2026: Franchise Preparations Begin',
        description: 'Indian Premier League franchises begin preparations for the 2026 season. Exciting player auctions and team building activities are underway.',
        source: 'Cricbuzz',
        category: 'cricket',
        date: '2025-12-22',
        url: 'https://www.cricbuzz.com/'
      },
      {
        id: '4',
        title: 'Test Cricket: West Indies Tour Announced',
        description: 'West Indies cricket team announces their tour schedule for the upcoming season. Multiple test matches against top international teams are planned.',
        source: 'Cricket.com.au',
        category: 'cricket',
        date: '2025-12-21',
        url: 'https://www.cricket.com.au/news'
      },
      {
        id: '5',
        title: 'Women\'s Cricket: Championship Starts',
        description: 'Women\'s cricket championship kicks off with exciting matches between international teams. Rising stars showcase their talents on the global stage.',
        source: 'Cricbuzz',
        category: 'cricket',
        date: '2025-12-20',
        url: 'https://www.cricbuzz.com/'
      },
      {
        id: '6',
        title: 'T20 World League: Format Changes Announced',
        description: 'ICC announces significant format changes for the upcoming T20 World League. New rules aim to make the game more exciting for fans worldwide.',
        source: 'Cricket.com.au',
        category: 'cricket',
        date: '2025-12-19',
        url: 'https://www.cricket.com.au/news'
      },
      {
        id: '7',
        title: 'Domestic Cricket: Sheffield Shield Highlights',
        description: 'Latest domestic cricket action featuring intense competition between Australian states in the Sheffield Shield tournament.',
        source: 'Cricbuzz',
        category: 'cricket',
        date: '2025-12-18',
        url: 'https://www.cricbuzz.com/'
      },
      {
        id: '8',
        title: 'International Cricket: England Tour Update',
        description: 'England cricket team provides updates on their upcoming tour with comprehensive match schedules and player statistics.',
        source: 'Cricket.com.au',
        category: 'cricket',
        date: '2025-12-17',
        url: 'https://www.cricket.com.au/news'
      },
      {
        id: '9',
        title: 'Young Cricketers: Rising Talent Showcase',
        description: 'New generation of cricketers from the subcontinent showcase their skills in domestic leagues. Scouts closely monitoring their performances.',
        source: 'Cricbuzz',
        category: 'cricket',
        date: '2025-12-16',
        url: 'https://www.cricbuzz.com/'
      },
      // Football
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
      // Basketball
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
      // Tennis
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
      // Sports / CPSC News
      {
        id: '1',
        title: 'CPSC-A VS TROOPERS',
        description: 'In a thrilling match between CPSC and Troopers, CPSC won the toss and elected to field first. With an excellent start from bowlers Vishal and Harry, CPSC got an early wicket and a spectacular catch by Harry at point. CPSC sealed the deal with a win by 6 wickets, concluding the innings by 2:55 PM.',
        source: 'CPSC Club News',
        category: 'sports',
        date: '2025-12-29',
        url: '#'
      },
    ];

    return allArticles.filter(a => a.category === category);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-blue-100 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-primary)]"></div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-blue-100 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
            <Link href="/news">
              <button className="px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white font-bold rounded-lg hover:shadow-lg transition-all">
                Back to News
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-100 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <Link href="/news">
          <button className="mb-8 px-4 py-2 text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)]/10 rounded-lg transition-all">
            ← Back to News
          </button>
        </Link>

        {/* Article Container */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] px-8 py-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-bold">
                {article.category.toUpperCase()}
              </span>
              <span className="text-white/80 text-sm">{article.date}</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-white/90 font-semibold text-lg">{article.source}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 sm:p-12">
            {/* Player Image */}
            {(article as any).playerImage && (
              <div className="mb-12">
                <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-indigo-100 flex items-center justify-center border-4 border-white">
                  <img 
                    src={(article as any).playerImage} 
                    alt={article.title}
                    className="max-h-full max-w-full object-contain drop-shadow-xl transition-transform duration-300 hover:scale-105"
                  />
                  {/* Decorative overlay */}
                  <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-[var(--color-primary-2)] opacity-30"></div>
                </div>
                {/* Player Name Title */}
                <div className="-mt-8 mb-2 flex justify-center">
                  <span className="px-6 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white text-2xl font-extrabold rounded-full shadow-lg border-2 border-white backdrop-blur-md">
                    {(article as any).playerName || 'Pankaj -37*'}
                  </span>
                </div>
                {(article as any).scorecardUrl && (
                  <div className="mt-2 flex gap-3 justify-center">
                    <a 
                      href={(article as any).scorecardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-blue-100 text-[var(--color-primary)] font-bold rounded-lg border-2 border-[var(--color-primary-2)] shadow-2xl hover:bg-blue-200 hover:text-[var(--color-primary-2)] transition-all inline-block"
                    >
                      View Scorecard →
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Fallback Icon if no image */}
            {!(article as any).playerImage && (
              <div className="w-full h-64 sm:h-96 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-2)]/20 rounded-lg flex items-center justify-center mb-8">
                <span className="text-8xl">📰</span>
              </div>
            )}

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {article.description}
              </p>

              {/* Full Article Content */}
              {(article as any).content && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Full Article</h2>
                  <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {(article as any).content}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border-l-4 border-[var(--color-primary)] p-6 rounded my-8">
                <h3 className="text-lg font-bold text-gray-900 mb-2">About This Article</h3>
                <ul className="text-gray-700 space-y-2">
                  <li><strong>Category:</strong> {article.category.charAt(0).toUpperCase() + article.category.slice(1)}</li>
                  <li><strong>Published:</strong> {article.date}</li>
                  <li><strong>Source:</strong> {article.source}</li>
                </ul>
              </div>

              <p className="text-gray-600 italic mt-8">
                This article provides important updates and insights about {article.category} news. Stay tuned for more coverage and analysis.
              </p>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-gray-600 text-sm">
                <strong>Source:</strong> {article.source}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Published on {article.date}
              </p>
            </div>
            <Link href="/news">
              <button className="px-6 py-2 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                View More News →
              </button>
            </Link>
          </div>
        </article>

        {/* Related Articles Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More News</h2>
          <Link href="/news">
            <button className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white font-bold rounded-lg hover:shadow-xl transition-all">
              Browse All Articles →
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
