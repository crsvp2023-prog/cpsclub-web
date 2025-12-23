'use client';

import Image from "next/image";

const fanFestPhotos = [
  { src: "/images/fanfest/fanfest-1.jpg", alt: "Fan Fest 2024 - Team photo" },
  { src: "/images/fanfest/fanfest-2.jpg", alt: "Fan Fest 2024 - Event highlights" },
  { src: "/images/fanfest/fanfest-3.jpg", alt: "Fan Fest 2024 - Cricket action" },
  { src: "/images/fanfest/fanfest-4.jpg", alt: "Fan Fest 2024 - Crowd moments" },
];

export default function FanFestGallery() {
  return (
    <section id="gallery" className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-[var(--color-dark)] mb-3">
            Fan Fest 2024
          </h2>
          <p className="text-2xl text-[var(--color-primary-2)] font-semibold mb-4">
            with Brett Lee
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are excited to share the highlights from the Fan Fest 2024 held on <span className="font-semibold">Sunday, 22 September 2024</span>, at the Chatswood Premier Sports Club in association with <span className="font-semibold">JICS</span>. The event was a resounding success, thanks to the incredible planning and organization by our team. <span className="text-[var(--color-primary)] font-semibold">Special thanks to Aman Sethi</span>.
          </p>
        </div>

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
  );
}
