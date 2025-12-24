'use client';

import Image from "next/image";

const smcaPhotos = [
  { src: "https://cpsclub.com.au/wp-content/uploads/2023/05/IMG-20230506-WA0025.jpg", alt: "SMCA - Match moment 1" },
  { src: "https://cpsclub.com.au/wp-content/uploads/2023/05/IMG-20230527-WA0001.jpg", alt: "SMCA - Match moment 2" },
  { src: "https://cpsclub.com.au/wp-content/uploads/2023/05/IMG-20230527-WA0003.jpg", alt: "SMCA - Match moment 3" },
  { src: "https://cpsclub.com.au/wp-content/uploads/2023/05/IMG-20230506-WA0009-1.jpg", alt: "SMCA - Match moment 4" },
];

export default function SMCAGallery() {
  return (
    <section id="smca-gallery" className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-[var(--color-dark)] mb-3">
            SMCA Tournament
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Highlights from our SMCA cricket tournament
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {smcaPhotos.map((photo, idx) => (
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
