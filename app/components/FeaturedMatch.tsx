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

const featuredMatch: Match = {
  id: 1,
  title: "C-Grade Match",
  date: "2026-01-10",
  time: "13:00",
  location: "Primrose Park / Oval 1",
  opponent: "CPSC vs Old Ignatians (Taronga)",
  matchType: "One Day Match"
};

export default function FeaturedMatch() {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parseInt(month) - 1];
    return `${monthName} ${parseInt(day)}, ${year}`;
  };

  return (
    <section id="featured-match" className="bg-gradient-to-br from-white via-blue-50 to-green-50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Featured Match Flash Card */}
        <div className="group relative perspective">
          {/* Card Container with 3D effect */}
          <div className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)]/90 to-[var(--color-primary-2)] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
               style={{
                 backgroundImage: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 50%, var(--color-primary-2) 100%)`
               }}>
            
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-8">
              {/* Badge */}
              <div className="inline-block mb-3 px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/40">
                <p className="text-xs font-bold text-white uppercase tracking-widest">🎯 Next Match</p>
              </div>

              {/* Main Content Grid */}
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Left Side - Match Details */}
                <div>
                  {/* Match Type and Opponent */}
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg leading-tight">
                    {featuredMatch.opponent}
                  </h3>
                  <p className="text-lg font-bold text-white/90 mb-4 drop-shadow">{featuredMatch.matchType}</p>

                  {/* Details Grid */}
                  <div className="space-y-3 mb-6">
                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h12a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">Date</p>
                        <p className="text-base font-bold text-white">{formatDate(featuredMatch.date)}</p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.293.707l-.707.707a1 1 0 101.414 1.414L9 9.414V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">Time</p>
                        <p className="text-base font-bold text-white">{featuredMatch.time}</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">Venue</p>
                        <p className="text-base font-bold text-white">{featuredMatch.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Visual Highlight */}
                <div className="relative flex items-center justify-center h-40 md:h-48">
                  <div className="text-center">
                    <div className="text-6xl md:text-7xl mb-3 drop-shadow-lg">🏏</div>
                    <p className="text-xl md:text-2xl font-black text-white drop-shadow-lg">MATCH DAY</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button className="flex-1 px-6 py-3 bg-white text-[var(--color-primary)] rounded-xl font-bold text-base hover:shadow-lg hover:scale-105 transition-all duration-300 drop-shadow-lg">
                  Register
                </button>
                <a
                  href="/events"
                  className="flex-1 px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold text-base hover:bg-white/30 hover:scale-105 transition-all duration-300 drop-shadow-lg"
                >
                  All Matches
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
