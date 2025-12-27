import Hero from "./components/Hero";
import Sponsors from "./components/Sponsors";
import InstagramFeed from "./components/InstagramFeed";
import FacebookFeed from "./components/FacebookFeed";
import MatchCountdown from "./components/MatchCountdown";
import MatchPredictions from "./components/MatchPredictions";
import SponsorSpotlight from "./components/SponsorSpotlight";
import NewsletterSignup from "./components/NewsletterSignup";
import FeaturedSeries from "./components/FeaturedSeries";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="relative z-10">
        <Hero />

        {/* About Section */}
        <section className="py-6 sm:py-12 px-4 sm:px-6 bg-gradient-to-r from-[#0066FF] via-[#0052CC] to-[#003B82] border-t border-[var(--color-accent)]/30">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
              {/* Left Column - Text Content */}
              <div>
                <div className="inline-block mb-3 sm:mb-4 px-3 py-1 bg-white/20 rounded-full border border-white/30">
                  <p className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wide">Our Story</p>
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  About <span className="text-[var(--color-accent)]">CPS Club</span>
                </h2>
                
                <div className="space-y-3 sm:space-y-4 text-white/90 text-sm sm:text-base leading-relaxed">
                  <p>
                    In <span className="font-semibold text-white">March 2023</span>, after more than seven years since its inception, a community cricket initiative was given a new identity and purpose. The dedicated group of cricket enthusiasts based in <span className="font-semibold text-white">Chatswood</span> decided to formalize their endeavor, leading to the incorporation of the club as the <span className="font-semibold text-white">Chatswood Premier Sports Club</span>.
                  </p>
                  
                  <p>
                    The primary goal of this initiative has always been to foster <span className="font-semibold text-white">physical fitness</span> and create a <span className="font-semibold text-white">sense of unity</span> within the community. Regardless of age or skill level, the club provided a welcoming platform for individuals to come together, socialize, and partake in the joy of cricket.
                  </p>

                  <p>
                    With the adoption of the motto <span className="font-semibold text-[var(--color-accent)]">"One Team, One Dream,"</span> the newly established Chatswood Premier Sports Club aimed to reinforce the collective spirit and shared aspirations of its members.
                  </p>
                </div>

                {/* Motto Box - Clean Design */}
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/10 rounded-lg text-white shadow-lg border border-white/20">
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Our Motto</p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3" style={{ color: '#FFD100' }}>One Team,<br />One Dream</h3>
                  <p className="text-xs sm:text-sm text-white/90 font-medium">Unity. Excellence. Community.</p>
                </div>
              </div>

              {/* Right Column - Fan Fest Section */}
              <div>
                <div className="inline-block px-3 py-1 bg-[var(--color-accent)]/20 rounded-full mb-3 sm:mb-4 border border-[var(--color-accent)]/40">
                  <p className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">⭐ Featured Highlight</p>
                </div>
                
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                  Fan Fest <span className="text-[var(--color-accent)]">2024</span>
                </h3>
                <p className="text-lg sm:text-2xl font-bold text-[var(--color-accent)] mb-4 sm:mb-6">with Brett Lee</p>
                
                {/* Fan Fest Photos - 2x2 Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {[1, 2, 3, 4].map((num) => (
                    <div 
                      key={num} 
                      className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer ring-2 ring-white/20"
                    >
                      <Image
                        src={`/images/fanfest/fanfest-${num}.webp`}
                        alt={`Fan Fest 2024 - Photo ${num}`}
                        width={200}
                        height={200}
                        className="w-full h-32 sm:h-40 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
                
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                  Fan Fest 2024 held on <span className="font-semibold">Sunday, 22 September 2024</span>, featured the legendary <span className="font-semibold text-[var(--color-accent)]">Brett Lee</span> and was a resounding success!
                </p>
                
                <div className="flex flex-col gap-3">
                  <a
                    href="/gallery"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--color-accent)] text-[var(--color-dark)] rounded-lg font-bold text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 uppercase tracking-wider w-full"
                  >
                    View Gallery →
                  </a>
                  <a
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-white/30 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-white/10 transition-all duration-300 w-full"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Match Countdown & Predictions - Single Row with Equal Columns */}
        <div className="py-6 sm:py-8 px-4 sm:px-6 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
              <div className="space-y-3 sm:space-y-4 flex flex-col h-full">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Next Match</h2>
                <div className="flex-1">
                  <MatchCountdown />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 flex flex-col h-full">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Make Your Prediction</h2>
                <div className="flex-1">
                  <MatchPredictions />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Series */}
        <div className="py-6 sm:py-8 px-4 sm:px-6 bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#003B82]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Featured Series</h2>
            <FeaturedSeries />
          </div>
        </div>

        {/* Sponsor Spotlight */}
        <div className="py-8 sm:py-12 px-4 sm:px-6 bg-gradient-to-r from-[#0038A8] via-[#0052CC] to-[#0066FF]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">Featured Sponsor</h2>
            <SponsorSpotlight />
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 sm:py-12 px-4 sm:px-6 bg-gradient-to-r from-[#0052CC] via-[#003B82] to-[#002855] border-t border-[var(--color-accent)]/30">
          <div className="max-w-7xl mx-auto">
            <NewsletterSignup />
          </div>
        </div>
        
        {/* Social Feeds */}
        <div className="py-8 sm:py-12 px-4 sm:px-6 bg-gradient-to-r from-[#0066FF] via-[#0052CC] to-[#003B82] border-t border-[var(--color-accent)]/30">
          <div className="max-w-7xl mx-auto">
            <InstagramFeed />
          </div>
        </div>
        
        <div className="py-8 sm:py-12 px-4 sm:px-6 bg-gradient-to-r from-[#003B82] via-[#0052CC] to-[#0066FF] border-t border-[var(--color-accent)]/30">
          <div className="max-w-7xl mx-auto">
            <FacebookFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
