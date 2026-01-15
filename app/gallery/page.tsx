'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: 'fanfest' | 'tournament' | 'match' | 'event';
  date: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    src: '/images/fanfest/fanfest-1.webp',
    alt: 'Fan Fest 2024 - Team photo',
    category: 'fanfest',
    date: '22 Sep 2024',
    description: 'Team gathering at Fan Fest',
  },
  {
    id: '2',
    src: '/images/fanfest/fanfest-2.webp',
    alt: 'Fan Fest 2024 - Event highlights',
    category: 'fanfest',
    date: '22 Sep 2024',
    description: 'Event highlights and celebrations',
  },
  {
    id: '3',
    src: '/images/fanfest/fanfest-3.webp',
    alt: 'Fan Fest 2024 - Cricket action',
    category: 'fanfest',
    date: '22 Sep 2024',
    description: 'Cricket action on the field',
  },
  {
    id: '4',
    src: '/images/fanfest/fanfest-4.webp',
    alt: 'Fan Fest 2024 - Crowd moments',
    category: 'fanfest',
    date: '22 Sep 2024',
    description: 'Memorable crowd moments',
  },
  {
    id: '5',
    src: 'https://cpsclub.com.au/wp-content/uploads/2023/05/IMG-20230506-WA0025.jpg',
    alt: 'SMCA Tournament match',
    category: 'tournament',
    date: '06 May 2023',
    description: 'SMCA tournament match moments',
  },
  {
    id: '6',
    src: 'https://cpsclub.com.au/wp-content/uploads/2023/05/IMG-20230527-WA0001.jpg',
    alt: 'SMCA Tournament action',
    category: 'tournament',
    date: '27 May 2023',
    description: 'Live tournament action',
  },
  {
    id: '7',
    src: 'https://cpsclub.com.au/wp-content/uploads/2023/05/IMG-20230527-WA0003.jpg',
    alt: 'SMCA Tournament highlights',
    category: 'tournament',
    date: '27 May 2023',
    description: 'Tournament highlights',
  },
  {
    id: '8',
    src: 'https://cpsclub.com.au/wp-content/uploads/2023/05/IMG-20230506-WA0009-1.jpg',
    alt: 'SMCA Tournament finale',
    category: 'tournament',
    date: '06 May 2023',
    description: 'Tournament finale moments',
  },
];

const categories = [
  { id: 'all', label: 'All Photos', count: galleryItems.length },
  { id: 'fanfest', label: 'Fan Fest 2024', count: galleryItems.filter(i => i.category === 'fanfest').length },
  { id: 'tournament', label: 'SMCA Tournament', count: galleryItems.filter(i => i.category === 'tournament').length },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const handleImageClick = (item: GalleryItem) => {
    setSelectedImage(item);
    setCurrentImageIndex(filteredItems.indexOf(item));
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredItems.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredItems[nextIndex]);
  };

  const handlePrevImage = () => {
    const prevIndex = (currentImageIndex - 1 + filteredItems.length) % filteredItems.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredItems[prevIndex]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f4ff] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--color-primary)] rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--color-accent)] rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-[var(--color-primary-2)] rounded-full opacity-3 blur-2xl"></div>
      
      <div className="relative z-10">
      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-[var(--color-primary-2)]/10 rounded-full border border-[var(--color-primary-2)] mb-6">
            <p className="text-sm font-semibold text-[var(--color-primary-2)]">Memory Gallery</p>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-dark)] mb-4">
            Our <span className="text-[var(--color-primary)]">Gallery</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore memorable moments from CPS Club events, tournaments, and matches. Click any image to view full details.
          </p>
        </div>
      </section>

      {/* CPSC Magic Moments Video */}
      <section className="px-6 pb-10">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 pt-6 pb-4 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-primary-2)] uppercase mb-1">
                CPSC Magic Moments
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]">
                Highlight Reel
              </h2>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Watch some of our favourite on-field and off-field moments.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold">
              🎥 HD Video
            </span>
          </div>
          <div className="w-full bg-black">
            <video
              className="w-full h-auto max-h-[480px] object-contain bg-black"
              controls
              preload="metadata"
            >
              <source src="/videos/CPSC-Memories.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedImage(null);
                }}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white shadow-lg scale-105'
                    : 'bg-white border-2 border-gray-300 text-[var(--color-dark)] hover:border-[var(--color-primary)]'
                }`}
              >
                {category.label}
                <span className="text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleImageClick(item)}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-gray-200 hover:border-[var(--color-primary)] bg-white">
                  <div className="relative w-full h-72">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white font-bold text-lg">{item.description}</p>
                    <p className="text-white/80 text-sm">{item.date}</p>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 bg-[var(--color-primary)]/90 text-white px-3 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.category === 'fanfest' ? '🎉' : '🏏'} {item.category === 'fanfest' ? 'Fan Fest' : 'Tournament'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500">No photos found in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="max-w-4xl w-full max-h-[90vh] relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-3xl font-bold hover:text-gray-300 transition-colors"
            >
              ✕
            </button>

            {/* Image */}
            <div className="relative w-full h-[60vh] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
              />
            </div>

            {/* Image Info */}
            <div className="bg-white rounded-b-lg p-6 mt-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-2">
                    {selectedImage.description}
                  </h2>
                  <p className="text-gray-600">{selectedImage.date}</p>
                </div>
                <span className="px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm font-semibold">
                  {selectedImage.category === 'fanfest' ? '🎉 Fan Fest' : '🏏 Tournament'}
                </span>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePrevImage}
                  className="px-6 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-all"
                >
                  ← Previous
                </button>

                <div className="text-sm text-gray-600">
                  {currentImageIndex + 1} of {filteredItems.length}
                </div>

                <button
                  onClick={handleNextImage}
                  className="px-6 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-all"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Keyboard Navigation Hint */}
            <div className="text-center mt-4 text-white/70 text-sm">
              Use arrow keys or click Next/Previous to navigate
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-2)]/10 rounded-2xl p-8 border-2 border-[var(--color-primary)]/20">
              <h3 className="text-3xl font-bold text-[var(--color-dark)] mb-2">
                {galleryItems.length}+
              </h3>
              <p className="text-gray-700 text-lg">
                High-quality photos from our events
              </p>
            </div>

            <div className="bg-gradient-to-br from-[var(--color-primary-2)]/10 to-[var(--color-accent)]/10 rounded-2xl p-8 border-2 border-[var(--color-primary-2)]/20">
              <h3 className="text-3xl font-bold text-[var(--color-dark)] mb-2">
                {categories.length}
              </h3>
              <p className="text-gray-700 text-lg">
                Curated event categories
              </p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}
