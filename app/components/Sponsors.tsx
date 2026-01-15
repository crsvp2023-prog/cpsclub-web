'use client';

import Image from "next/image";
import { sponsors } from "../data/sponsors";

export default function Sponsors() {
  // Duplicate sponsors for seamless infinite scroll
  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors];

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-dark)] mb-4 animate-fadeInDown">
            All Our Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fadeInUp">
            We're proud to partner with leading organizations that share our passion for cricket and community excellence.
          </p>
        </div>

        {/* Scrolling carousel with infinite loop */}
        <div className="relative w-full overflow-hidden py-8">
          <div className="flex gap-8 animate-scroll">
            {duplicatedSponsors.map((sponsor, idx) => {
              const isPrimary = sponsor.tier === "primary";

              return (
              <a
                key={idx}
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative rounded-lg p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 flex-shrink-0 min-w-56 w-56 h-52 flex flex-col items-center justify-center animate-cardSlideIn border ${
                  isPrimary
                    ? "bg-gradient-to-b from-white via-white to-blue-50 border-[var(--color-accent)]"
                    : "bg-white border-gray-200 hover:border-[var(--color-accent)]"
                }`}
                style={{ animationDelay: `${(idx % sponsors.length) * 0.1}s` }}
              >
                {/* Accent bar on top */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-lg transition-opacity ${
                    isPrimary
                      ? "bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-amber-400 opacity-100"
                      : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] opacity-0 group-hover:opacity-100"
                  }`}
                />
                
                <div className="flex flex-col items-center h-full justify-center text-center">
                  {isPrimary ? (
                    <span className="mb-2 inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 uppercase tracking-wide">
                      Primary Sponsor
                    </span>
                  ) : sponsor.role ? (
                    <span className="mb-2 inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-[0.7rem] font-semibold px-3 py-1 uppercase tracking-wide">
                      {sponsor.role}
                    </span>
                  ) : null}
                  <div className="w-full h-20 flex items-center justify-center mb-4">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={140}
                      height={70}
                      className="object-contain group-hover:scale-110 transition-transform duration-300 max-h-full"
                      unoptimized
                    />
                  </div>
                  <span className="text-sm font-bold text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                    {sponsor.name}
                  </span>
                </div>

                {/* Hover effect background */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-5 bg-[var(--color-primary)] pointer-events-none transition-opacity" />
              </a>
            );
            })}
          </div>

          {/* Gradient fade effect on sides */}
          <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-gray-50 via-gray-50 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-gray-50 via-gray-50 to-transparent pointer-events-none" />
        </div>

        {/* Bottom accent line */}
        <div className="mt-8 h-1 w-32 mx-auto bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-accent)] rounded-full" />
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

        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-scroll {
          display: flex;
          animation: scroll 60s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out 0.2s backwards;
        }

        .animate-cardSlideIn {
          animation: cardSlideIn 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
