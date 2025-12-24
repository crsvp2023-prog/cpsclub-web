'use client';

import Image from "next/image";
import { sponsors } from "../data/sponsors";

export default function Sponsors() {
  // Duplicate sponsors for seamless infinite scroll
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-dark)] mb-4 animate-fadeInDown">
            Our Trusted Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fadeInUp">
            We're proud to partner with leading organizations that share our passion for cricket and community excellence.
          </p>
        </div>

        {/* Scrolling carousel with infinite loop */}
        <div className="relative overflow-hidden">
          <div className="flex gap-8 animate-marquee">
            {duplicatedSponsors.map((sponsor, idx) => (
              <a
                key={idx}
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-[var(--color-accent)]/50 flex-shrink-0 w-64"
              >
                {/* Accent bar on top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col items-center h-full justify-center">
                  <div className="w-full h-24 flex items-center justify-center mb-4 relative">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={120}
                      height={60}
                      className="object-contain group-hover:scale-125 transition-transform duration-300 max-h-full"
                    />
                  </div>
                  
                  <span className="text-sm font-semibold text-[var(--color-dark)] text-center group-hover:text-[var(--color-primary)] transition-colors">
                    {sponsor.name}
                  </span>
                </div>

                {/* Hover indicator */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-5 bg-[var(--color-primary)] pointer-events-none transition-opacity" />
              </a>
            ))}
          </div>

          {/* Gradient fade effect on sides */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-50 via-gray-50 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-50 via-gray-50 to-transparent pointer-events-none" />
        </div>

        {/* Bottom accent line */}
        <div className="mt-16 h-1 w-32 mx-auto bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-accent)] rounded-full" />
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

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
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
