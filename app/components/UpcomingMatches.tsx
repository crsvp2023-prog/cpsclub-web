'use client';

interface Match {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  opponent: string;
  matchType: string;
}

const upcomingMatches: Match[] = [
  {
    id: 1,
    title: "vs Strathfield",
    date: "2025-01-15",
    time: "14:30",
    location: "Chatswood Oval",
    opponent: "Strathfield CC",
    matchType: "Grade Match"
  },
  {
    id: 2,
    title: "vs Mosman",
    date: "2025-01-22",
    time: "10:00",
    location: "Mosman Oval",
    opponent: "Mosman CC",
    matchType: "Friendly"
  },
  {
    id: 3,
    title: "vs Lindfield",
    date: "2025-02-05",
    time: "14:30",
    location: "Lindfield Oval",
    opponent: "Lindfield CC",
    matchType: "Grade Match"
  }
];

export default function UpcomingMatches() {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parseInt(month) - 1];
    return `${monthName} ${parseInt(day)}, ${year}`;
  };

  return (
    <section id="upcoming-matches" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-3 px-4 py-2 bg-orange-100 rounded-full border border-orange-300">
            <p className="text-sm font-semibold text-orange-700">🏏 Schedule</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-dark)] mb-3">
            Upcoming Matches
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't miss our exciting upcoming cricket matches
          </p>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingMatches.map((match, idx) => (
            <div
              key={match.id}
              className="group relative bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary-2)]/5 rounded-xl overflow-hidden border-2 border-[var(--color-primary)]/30 hover:border-[var(--color-accent)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] opacity-100 group-hover:h-2 transition-all" />
              
              <div className="p-6">
                {/* Match Type Badge */}
                <div className="inline-block mb-4 px-3 py-1 bg-orange-100 rounded-full">
                  <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">{match.matchType}</p>
                </div>

                {/* Match Title */}
                <h3 className="text-2xl font-extrabold text-[var(--color-dark)] mb-2">
                  {match.title}
                </h3>
                <p className="text-sm text-gray-600 mb-6 font-semibold">{match.opponent}</p>

                {/* Match Details */}
                <div className="space-y-3">
                  {/* Date */}
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="flex-shrink-0 w-5 h-5 rounded bg-[var(--color-primary)]/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-semibold">{formatDate(match.date)}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="flex-shrink-0 w-5 h-5 rounded bg-[var(--color-primary)]/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="font-semibold">{match.time}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="flex-shrink-0 w-5 h-5 rounded bg-[var(--color-primary)]/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="font-semibold">{match.location}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full mt-6 px-6 py-3 bg-[var(--color-accent)] text-[var(--color-dark)] rounded-lg font-black hover:shadow-lg hover:scale-105 transition-all duration-300 uppercase tracking-wider hover:bg-[#FFC939]">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/events"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[var(--color-accent)] text-[var(--color-dark)] rounded-full font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 uppercase tracking-wider hover:bg-[#FFC939]"
          >
            📅 View Full Schedule
            <span>→</span>
          </a>
        </div>

        {/* Accent line */}
        <div className="mt-12 h-1 w-32 mx-auto bg-gradient-to-r from-[var(--color-primary)] via-orange-400 to-[var(--color-primary-2)] rounded-full" />
      </div>
    </section>
  );
}
