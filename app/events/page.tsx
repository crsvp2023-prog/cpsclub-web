'use client';

import Card from "../components/Card";
import { useState } from "react";

const events = [
  {
    id: 1,
    title: "NCU Summer Tournament",
    date: "October 15, 2026",
    location: "Chatswood Premier Sports Club",
    time: "1:00 PM - 6:00 PM",
    description: "Join us for an exciting summer cricket tournament featuring multiple divisions and age groups. Compete with players from the community and showcase your skills on the field.",
    category: "Tournament",
    attendees: 25,
    status: "Going On"
  },
  {
    id: 2,
    title: "Community Meetup",
    date: "February 5, 2026",
    location: "Chatswood RSL Club",
    time: "6:00 PM - 8:00 PM",
    description: "A casual gathering for cricket enthusiasts to network, share stories, and discuss upcoming events. Light refreshments will be served. All skill levels welcome!",
    category: "Social",
    attendees: 25,
    status: "Upcoming"
  },
  {
    id: 3,
    title: "Senior Cricket Coaching",
    date: "Every Saturday",
    location: "Chatswood Premier Sports Club",
    time: "9:00 AM - 11:00 AM",
    description: "Professional coaching sessions for senior cricketers. Advanced batting, bowling, and fielding techniques from experienced coaches. Focus on competitive cricket strategies and fitness. Registration required.",
    category: "Training",
    attendees: 45,
    status: "Upcoming"
  },
  {
    id: 4,
    title: "Winter League",
    date: "March 1 - August 30, 2026",
    location: "Multiple Venues",
    time: "Flexible Timings",
    description: "Our annual winter league format bringing teams together for friendly competition. Multiple matches weekly with social events in between. Perfect for competitive and casual players.",
    category: "League",
    attendees: 50,
    status: "Upcoming"
  }
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredEvents = selectedCategory
    ? events.filter(event => event.category === selectedCategory)
    : events;

  const categories = ["Tournament", "Social", "Training", "League"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--color-dark)] via-blue-50 to-green-50 pt-20">
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
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
      `}</style>
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero Header Section */}
        <div className="text-center mb-16 animate-fadeInDown">
          <div className="inline-block px-4 py-2 bg-[var(--color-accent)]/20 rounded-full border-2 border-[var(--color-accent)] mb-4 backdrop-blur-sm">
            <p className="text-sm font-bold text-[var(--color-accent)]">🎯 CRICKET UNLEASHED</p>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-lg">
            Game <span className="text-[var(--color-accent)]">On</span>
          </h1>
          <p className="text-2xl font-bold mb-3">
            <span className="bg-gradient-to-r from-[var(--color-primary-2)] via-[var(--color-accent)] to-[var(--color-primary-2)] bg-clip-text text-transparent">
              Experience The Thrill
            </span>
          </p>
          <p className="text-lg text-gray-300 mb-6">Join our community events and be part of something special ⚡</p>
          <div className="flex justify-center gap-4">
            <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-white font-bold">🏆 4 Active Events</span>
            </div>
            <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-white font-bold">145 Players</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 ${
              selectedCategory === null
                ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white shadow-xl scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-[var(--color-primary)]"
            }`}
          >
            All Events
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-[var(--color-primary-2)] to-[var(--color-accent)] text-white shadow-xl scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-[var(--color-primary-2)]"
              }`}
            >
              {category === "Tournament" && "🏆"} 
              {category === "Social" && "🎉"} 
              {category === "Training" && "📚"} 
              {category === "League" && "⚡"} 
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-2 border-gray-100 hover:border-[var(--color-accent)] cursor-pointer"
              style={{
                animation: `fadeInDown 0.6s ease-out ${index * 0.15}s both`,
              }}
            >
              {/* Animated Top Gradient Bar */}
              <div className="h-2 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-accent)] group-hover:via-[var(--color-accent)]"></div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide ${
                  event.status === "Upcoming"
                    ? "bg-blue-100 text-[var(--color-primary)]"
                    : event.status === "Going On"
                    ? "bg-green-100 text-[var(--color-primary-2)]"
                    : "bg-amber-100 text-[var(--color-accent)]"
                } shadow-md`}>
                  ● {event.status}
                </span>
              </div>

              {/* Category Badge with Icon */}
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] text-white rounded-full text-xs font-black uppercase shadow-md">
                  {event.category === "Tournament" && "🏆 Tournament"}
                  {event.category === "Social" && "🎉 Social"}
                  {event.category === "Training" && "📚 Training"}
                  {event.category === "League" && "⚡ League"}
                </span>
              </div>

              {/* Content */}
              <div className="p-8 pt-14">
                <h3 className="text-2xl md:text-3xl font-black text-[var(--color-dark)] mb-4 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                  {event.title}
                </h3>

                {/* Event Details with enhanced styling */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-800">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Date</p>
                      <p className="font-black text-lg">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-800">
                    <span className="text-2xl">🕐</span>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Time</p>
                      <p className="font-semibold">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-800">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
                      <p className="font-semibold">{event.location}</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t-2 border-gray-200 py-5 my-4"></div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed mb-6 font-medium line-clamp-3">
                  {event.description}
                </p>

                {/* Footer with attendees and CTA */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Attending</p>
                      <p className="text-xl font-black text-[var(--color-primary-2)]">{event.attendees}</p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-[var(--color-primary-2)] to-[var(--color-accent)] text-white rounded-xl font-black text-sm uppercase tracking-wide hover:shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95">
                    JOIN 🚀
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No events found in this category.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl p-12 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-accent)]"></div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-lg">
              🔥 Never Miss An Event!
            </h2>
            <p className="text-xl mb-8 opacity-95 font-semibold">
              Get instant notifications and exclusive updates about all our cricket events
            </p>
            <div className="flex flex-col md:flex-row gap-3 justify-center max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/50 text-lg"
              />
              <button className="px-8 py-4 bg-white text-[var(--color-primary)] font-black rounded-xl hover:bg-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 uppercase tracking-wide">
                Subscribe Now 📬
              </button>
            </div>
            <p className="text-sm mt-4 opacity-80">✓ Zero spam • ✓ Unsubscribe anytime • ✓ Cricket-only updates</p>
          </div>
        </div>
      </section>
    </main>
  );
}
