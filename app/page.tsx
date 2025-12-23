import Hero from "./components/Hero";
import Sponsors from "./components/Sponsors";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* About */}
      <section id="about" className="bg-gradient-to-br from-white via-blue-50 to-green-50 py-20">
        <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-[var(--color-primary-2)]/10 rounded-full border border-[var(--color-primary-2)]">
              <p className="text-sm font-semibold text-[var(--color-primary-2)]">Our Story</p>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-extrabold text-[var(--color-dark)] mb-6 leading-tight">
              About <span className="text-[var(--color-primary-2)]">CPS Club</span>
            </h2>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                In <span className="font-semibold text-[var(--color-dark)]">March 2023</span>, after more than seven years since its inception, a community cricket initiative was given a new identity and purpose. The dedicated group of cricket enthusiasts based in Chatswood decided to formalize their endeavor, leading to the incorporation of the club as the Chatswood Premier Sports Club.
              </p>
              
              <p>
                The primary goal of this initiative has always been to foster <span className="font-semibold text-[var(--color-primary)]">physical fitness</span> and create a <span className="font-semibold text-[var(--color-primary)]">sense of unity</span> within the community. Regardless of age or skill level, the club provided a welcoming platform for individuals to come together, socialize, and partake in the joy of cricket.
              </p>
            </div>

            {/* Motto Box */}
            <div className="mt-8 p-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] rounded-xl text-white">
              <p className="text-sm font-semibold text-white/80 mb-2">OUR MOTTO</p>
              <h3 className="text-3xl font-extrabold">One Team, One Dream</h3>
              <p className="mt-2 text-white/90">Reinforcing the collective spirit and shared aspirations of our members</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-[var(--color-accent)]/10 rounded-full border border-[var(--color-accent)]">
              <p className="text-sm font-semibold text-[var(--color-accent)]">✨ Featured Event</p>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-extrabold text-[var(--color-dark)]">
              Fan Fest <span className="text-[var(--color-primary-2)]">2024</span>
            </h3>
            <p className="text-2xl font-bold text-[var(--color-primary-2)]">with Brett Lee</p>
            
            {/* Fan Fest Photos Grid with hover effects */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div 
                  key={num} 
                  className="group relative rounded-xl overflow-hidden shadow-lg border-3 border-[var(--color-accent)]/30 hover:border-[var(--color-accent)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                >
                  <Image
                    src={`/images/fanfest/fanfest-${num}.webp`}
                    alt={`Fan Fest 2024 - Photo ${num}`}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white text-sm font-semibold p-3">Event Moment {num}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-[var(--color-dark)]/5 to-[var(--color-primary)]/5 rounded-xl p-6 border-l-4 border-[var(--color-primary-2)]">
              <p className="text-gray-700 leading-relaxed">
                We are excited to share the highlights from the <span className="font-bold text-[var(--color-dark)]">Fan Fest 2024</span> held on <span className="font-semibold">Sunday, 22 September 2024</span>, at the Chatswood Premier Sports Club in association with <span className="font-semibold">JICS</span>. The event was a resounding success, thanks to the incredible planning and organization by our team.
              </p>
              <p className="mt-3 text-[var(--color-primary)] font-bold">🎉 Special thanks to Aman Sethi for making this event memorable!</p>
            </div>
            
            <a
              href="/gallery"
              className="inline-flex items-center gap-2 mt-4 px-8 py-4 bg-gradient-to-r from-[var(--color-primary-2)] to-[var(--color-accent)] text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              🖼️ View Full Gallery
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
      
      <Sponsors />
    </>
  );
}
