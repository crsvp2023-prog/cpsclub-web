'use client';

import { useState, useEffect } from 'react';

interface Insight {
  title: string;
  content: string;
  emoji: string;
}

const FALLBACK_INSIGHTS = [
  {
    title: "Explosive Batting Expected",
    content: "With favorable pitch conditions and strong batting lineup, expect high-scoring cricket! The team's aggressive approach in the powerplay should set the tone for an exciting match.",
    emoji: "⚡"
  },
  {
    title: "Spin Could Be Key",
    content: "The pitch conditions suggest turn and bounce, making spinners crucial. Watch for spinners to take center stage in the middle overs with match-winning performances.",
    emoji: "🌪️"
  },
  {
    title: "Pace Attack Dominance",
    content: "Fast bowlers will have excellent conditions with the new ball. Early breakthroughs could set the momentum and decide the match outcome.",
    emoji: "🚀"
  },
  {
    title: "Close Contest Ahead",
    content: "Both teams are equally matched with balanced squads. Expect a nail-biting finish where fielding and decision-making will be the deciding factors.",
    emoji: "🔥"
  },
  {
    title: "Death Overs Drama",
    content: "The short boundaries and aggressive batting setup promise explosive cricket in the final overs. Expect six-hitting and boundary-breaking action!",
    emoji: "💥"
  }
];

export default function AIMatchInsights() {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const generateInsight = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/ai-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            matchType: 'T20',
            homeTeam: 'CPS Club',
            awayTeam: 'Opposition',
            context: 'Upcoming cricket match with exciting prospects'
          })
        });

        if (response.ok) {
          const data = await response.json();
          setInsight(data.insight);
          setIsUsingFallback(false);
        } else {
          // Use fallback insight
          const randomInsight = FALLBACK_INSIGHTS[Math.floor(Math.random() * FALLBACK_INSIGHTS.length)];
          setInsight(randomInsight);
          setIsUsingFallback(true);
        }
      } catch (err) {
        // Use fallback insight on error
        const randomInsight = FALLBACK_INSIGHTS[Math.floor(Math.random() * FALLBACK_INSIGHTS.length)];
        setInsight(randomInsight);
        setIsUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    generateInsight();
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] opacity-5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-12 border border-[var(--color-accent)]/20 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6" />
            <div className="h-4 bg-gray-200 rounded w-full mb-3" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </section>
    );
  }

  if (!insight) {
    return null;
  }

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-accent)] opacity-5" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute -bottom-8 left-10 w-72 h-72 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-accent)] bg-clip-text text-transparent mb-3">
            🤖 AI Match Intelligence
          </h2>
          <p className="text-lg text-gray-600">Powered by advanced AI analytics</p>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-[var(--color-accent)]/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start gap-6">
            <div className="text-5xl md:text-6xl flex-shrink-0">
              {insight.emoji}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-black text-[var(--color-primary)] mb-4 uppercase tracking-wide">
                {insight.title}
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {insight.content}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-block px-4 py-2 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full text-sm font-semibold">
                  ⚡ AI-Powered
                </span>
                <span className="inline-block px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm font-semibold">
                  🎯 Real-time Analysis
                </span>
                {isUsingFallback && (
                  <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    📊 Curated Insights
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>💡 Insights refresh with each page load for the latest match intelligence</p>
        </div>
      </div>
    </section>
  );
}
