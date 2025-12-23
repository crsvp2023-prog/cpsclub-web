'use client';

import Image from "next/image";
import { useState } from "react";

const fanFestPhotos = [
  { src: "/images/fanfest/fanfest-1.jpg", alt: "Fan Fest 2024 - Team photo" },
  { src: "/images/fanfest/fanfest-2.jpg", alt: "Fan Fest 2024 - Event highlights" },
  { src: "/images/fanfest/fanfest-3.jpg", alt: "Fan Fest 2024 - Cricket action" },
  { src: "/images/fanfest/fanfest-4.jpg", alt: "Fan Fest 2024 - Crowd moments" },
];

export default function FanFest() {
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const nextPhoto = () => {
    setCurrentPhoto((prev) => (prev + 1) % fanFestPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhoto((prev) => (prev - 1 + fanFestPhotos.length) % fanFestPhotos.length);
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-primary)] p-8 text-white overflow-hidden">
      {/* Photo Carousel */}
      <div className="relative mb-6 rounded-lg overflow-hidden">
        <div className="relative w-full h-80">
          <Image
            src={fanFestPhotos[currentPhoto].src}
            alt={fanFestPhotos[currentPhoto].alt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevPhoto}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all"
          aria-label="Previous photo"
        >
          ❮
        </button>
        <button
          onClick={nextPhoto}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all"
          aria-label="Next photo"
        >
          ❯
        </button>

        {/* Photo Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-sm">
          {currentPhoto + 1} / {fanFestPhotos.length}
        </div>
      </div>

      {/* Thumbnail dots */}
      <div className="flex justify-center gap-2 mb-6">
        {fanFestPhotos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPhoto(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentPhoto
                ? "bg-[var(--color-accent)] w-8"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to photo ${idx + 1}`}
          />
        ))}
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <div>
          <h4 className="text-3xl font-bold text-[var(--color-accent)] mb-2">Fan Fest 2024</h4>
          <p className="text-white/80 text-sm">with Brett Lee</p>
        </div>

        <div>
          <p className="text-sm text-white/70 font-semibold mb-2">EVENT DATE</p>
          <p className="text-lg font-bold">Sunday, 22 September 2024</p>
        </div>

        <p className="text-white/90 leading-relaxed text-sm">
          We are excited to share the highlights from the Fan Fest 2024 held at the Chatswood Premier Sports Club in association with JICS. The event was a resounding success, thanks to the incredible planning and organization by our team.
        </p>

        <div className="pt-4 border-t border-white/20">
          <p className="text-xs text-white/70 mb-2">SPECIAL THANKS TO</p>
          <p className="font-semibold text-[var(--color-accent)]">Aman Sethi</p>
        </div>
      </div>
    </div>
  );
}
