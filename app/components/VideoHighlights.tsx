'use client';

import { useState } from 'react';

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: 'highlights' | 'coaching' | 'events';
  date: string;
}

const videos: Video[] = [
  {
    id: '1',
    title: 'Cricket Tournament Highlights',
    description: 'Best moments from our cricket tournaments and match-winning performances',
    youtubeId: 'jZ3JNcJqifA',
    category: 'highlights',
    date: '2024-12-15'
  },
  {
    id: '2',
    title: 'Community Stories',
    description: 'Inspiring stories from our members and their cricket journey',
    youtubeId: '9bZzSwdS4gk',
    category: 'events',
    date: '2024-12-10'
  },
  {
    id: '3',
    title: 'Cricket Coaching Tips',
    description: 'Learn from our expert coaches with essential cricket techniques',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'coaching',
    date: '2024-12-05'
  },
  {
    id: '4',
    title: 'Fan Fest 2024 Highlights',
    description: 'Exclusive moments from our Fan Fest 2024 with Brett Lee',
    youtubeId: 'jZ3JNcJqifA',
    category: 'events',
    date: '2024-09-22'
  }
];

export default function VideoHighlights() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'highlights' | 'coaching' | 'events'>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0]);

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-[var(--color-accent)]/10 rounded-full border border-[var(--color-accent)]">
            <p className="text-sm font-bold text-[var(--color-accent)] uppercase tracking-wide">🎬 Video Content</p>
          </div>
          <h2 className="text-5xl font-bold text-[var(--color-dark)] mb-4">Video Highlights & Updates</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch the best moments from our tournaments, coaching sessions, and community events
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['all', 'highlights', 'coaching', 'events'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as any)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 uppercase tracking-wider text-sm ${
                selectedCategory === category
                  ? 'bg-[var(--color-accent)] text-[var(--color-dark)] shadow-lg'
                  : 'bg-white text-[var(--color-dark)] border-2 border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]'
              }`}
            >
              {category === 'all' ? '📺 All' : category === 'highlights' ? '🏆 Highlights' : category === 'coaching' ? '🎓 Coaching' : '🎉 Events'}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            {selectedVideo && (
              <div className="space-y-6">
                {/* Video Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  />
                </div>

                {/* Video Info */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full text-xs font-bold uppercase">
                      {selectedVideo.category === 'highlights' ? '🏆 Match Highlights' : selectedVideo.category === 'coaching' ? '🎓 Coaching' : '🎉 Event'}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(selectedVideo.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-3">{selectedVideo.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedVideo.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Video List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[var(--color-dark)] mb-6">Up Next</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredVideos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${
                    selectedVideo?.id === video.id
                      ? 'bg-[var(--color-accent)] text-[var(--color-dark)]'
                      : 'bg-white hover:bg-gray-50 border-2 border-transparent hover:border-[var(--color-accent)] text-[var(--color-dark)]'
                  }`}
                >
                  <h4 className="font-bold text-sm mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                    {video.title}
                  </h4>
                  <p className={`text-xs ${selectedVideo?.id === video.id ? 'text-[var(--color-dark)]/80' : 'text-gray-500'}`}>
                    {new Date(video.date).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Want to see more? Check out our full video collection</p>
          <a
            href="/gallery"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white rounded-lg font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            📸 View Gallery
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
