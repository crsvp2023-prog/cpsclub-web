'use client';

import Image from "next/image";

const fanFestPhotos = [
  { src: "/images/fanfest/fanfest-1.jpg", alt: "Fan Fest 2024 - Team photo" },
  { src: "/images/fanfest/fanfest-2.jpg", alt: "Fan Fest 2024 - Event highlights" },
  { src: "/images/fanfest/fanfest-3.jpg", alt: "Fan Fest 2024 - Cricket action" },
  { src: "/images/fanfest/fanfest-4.jpg", alt: "Fan Fest 2024 - Crowd moments" },
];

export default function GalleryPage() {
  return (
    <main className="pt-28 pb-20">
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {fanFestPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-[var(--color-accent)]/30 hover:border-[var(--color-accent)]"
              >
                <div className="relative w-full h-64">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white text-sm font-semibold p-4">{photo.alt.split(" - ")[1]}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Accent line */}
          <div className="mt-16 h-1 w-32 mx-auto bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-accent)] rounded-full" />
        </div>
      </section>
    </main>
  );
}
