'use client';

import { useState } from 'react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission');
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const achievements = [
    { year: '2020', title: '2 Cricket Tournaments Organized', icon: '🏏' },
    { year: '2020', title: 'AUD 8,000+ Donated to COVID Relief', icon: '🤝' },
    { year: '2024', title: '100+ Community Members', icon: '👥' },
    { year: '2025', title: 'Growing Cricket Community', icon: '🌟' }
  ];

  const videos = [
    {
      title: 'Cricket Tournament Highlights',
      description: 'Best moments from our cricket tournaments',
      youtubeId: 'jZ3JNcJqifA'
    },
    {
      title: 'Community Stories',
      description: 'Inspiring stories from our members',
      youtubeId: '9bZzSwdS4gk'
    }
  ];

  return (
    <>
    <main className="min-h-screen bg-white pt-20">
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-[var(--color-dark)] via-[#0033A8] to-[var(--color-primary)]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--color-accent)] rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--color-primary-2)] rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="animate-slideUp">
            <div className="inline-block mb-4 px-4 py-2 bg-[var(--color-accent)]/20 rounded-full border border-[var(--color-accent)]/50">
              <p className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider">Our Story</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">About CPS Club</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Uniting cricket enthusiasts since 2016, we're a community dedicated to excellence, wellness, and creating lasting connections.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-6 bg-gradient-to-r from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-[var(--color-primary)] mb-2">2016</p>
              <p className="text-gray-700 font-semibold">Founded</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-[var(--color-primary-2)] mb-2">100+</p>
              <p className="text-gray-700 font-semibold">Members</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-[var(--color-accent)] mb-2">2023</p>
              <p className="text-gray-700 font-semibold">Incorporated</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <p className="text-4xl font-bold text-[#00a652] mb-2">$8K+</p>
              <p className="text-gray-700 font-semibold">Donated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="animate-slideUp">
              <div className="inline-block mb-4 px-4 py-2 bg-[var(--color-primary-2)]/10 rounded-full border border-[var(--color-primary-2)]">
                <p className="text-sm font-semibold text-[var(--color-primary-2)] uppercase tracking-wider">Who We Are</p>
              </div>
              <h2 className="text-5xl font-bold text-[#0d3e2a] mb-6">Our Mission</h2>
              <p className="text-lg text-[#0d3e2a] leading-relaxed mb-6">
                We are a powerhouse of passionate, forward-thinking individuals united to empower every person to thrive, lead authentically, and foster genuine connections within an inclusive, vibrant community dedicated to wellness and mutual success.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h4 className="font-bold text-[#0d3e2a]">Excellence</h4>
                    <p className="text-[#1a5640]">Committed to the highest standards of sport and community</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl">🤝</div>
                  <div>
                    <h4 className="font-bold text-[#0d3e2a]">Community</h4>
                    <p className="text-[#1a5640]">Building strong connections and lasting relationships</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl">💪</div>
                  <div>
                    <h4 className="font-bold text-[#0d3e2a]">Wellness</h4>
                    <p className="text-[#1a5640]">Promoting physical fitness and mental well-being</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-slideUp relative" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-[var(--color-primary)] via-[#003d99] to-[#00215d] rounded-2xl p-12 text-white shadow-2xl border border-[var(--color-accent)]/20 relative overflow-hidden group">
                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-accent)] rounded-full opacity-5 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-6 animate-float">🏏</div>
                  <h3 className="text-5xl font-black mb-4" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.05em', color: '#FFD100' }}>One Team,<br />One Dream</h3>
                  <p className="text-lg text-white/90 mb-6 font-semibold" style={{ fontFamily: 'Arial, sans-serif' }}>
                    Our motto embodies the collective spirit and shared aspirations of every member in our community.
                  </p>
                  <div className="bg-white/10 backdrop-blur p-6 rounded-xl border border-[var(--color-accent)]/30">
                    <p className="text-sm text-white/80">Founded in 2016 and officially incorporated in 2023, CPS Club has grown into a thriving community of over 100 passionate cricket enthusiasts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Timeline */}
      <section className="py-24 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-[var(--color-accent)]/10 rounded-full border border-[var(--color-accent)]">
              <p className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider">Milestones</p>
            </div>
            <h2 className="text-5xl font-bold text-[var(--color-dark)]">Our Achievements</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="animate-slideUp group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-[var(--color-primary)] transition-all duration-300 h-full">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{achievement.icon}</div>
                  <p className="text-sm text-[var(--color-primary-2)] font-bold mb-2 uppercase tracking-wider">{achievement.year}</p>
                  <h3 className="text-lg font-bold text-gray-800">{achievement.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COVID Relief & Community Impact Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-[var(--color-primary)]/10 rounded-full border border-[var(--color-primary)]">
              <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Impact</p>
            </div>
            <h2 className="text-5xl font-bold text-[var(--color-dark)] mb-4">Community Impact</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">We don't just play cricket—we give back to the community that supports us</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Donation Card */}
            <div className="animate-slideUp group">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border-t-4 border-[var(--color-primary)]">
                <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] p-8">
                  <div className="text-6xl mb-4">💚</div>
                  <h3 className="text-2xl font-bold text-white">COVID-19 Relief</h3>
                  <p className="text-white/80 mt-2">2020 - Community Support</p>
                </div>
                <div className="p-8">
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-[var(--color-primary)] mb-2">$8,000+</p>
                    <p className="text-gray-700 font-semibold">Mobilized for Relief</p>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    When the pandemic hit hardest, our community came together. We mobilized over $8,000 in critical relief support, demonstrating our unwavering commitment to strengthening the communities we serve.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-600 font-semibold">✓ Official Certificate Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tournaments Card */}
            <div className="animate-slideUp group" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border-t-4 border-[var(--color-accent)]">
                <div className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary-2)] p-8">
                  <div className="text-6xl mb-4">🏏</div>
                  <h3 className="text-2xl font-bold text-white">Cricket Tournaments</h3>
                  <p className="text-white/80 mt-2">2020, 2022 - Community Events</p>
                </div>
                <div className="p-8">
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-[var(--color-accent)] mb-2">2 Events</p>
                    <p className="text-gray-700 font-semibold">Organized & Delivered</p>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    We orchestrated 2 landmark cricket tournaments that electrified the region, driving unprecedented engagement, promoting wellness, and inspiring a generation of cricket excellence.
                  </p>
                  <div className="bg-amber-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-600 font-semibold">✓ Photos & Videos Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Gallery Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-[var(--color-primary-2)]/10 rounded-full border border-[var(--color-primary-2)]">
              <p className="text-sm font-semibold text-[var(--color-primary-2)] uppercase tracking-wider">Media</p>
            </div>
            <h2 className="text-5xl font-bold text-[var(--color-dark)] mb-4">Gallery & Videos</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">Explore moments from our tournaments, events, and community gatherings</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex justify-center flex-wrap gap-3 mb-12">
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'certificates'
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg'
                  : 'bg-white text-[var(--color-dark)] border-2 border-gray-200 hover:border-[var(--color-primary)]'
              }`}
            >
              📜 Certificates
            </button>
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'tournaments'
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg'
                  : 'bg-white text-[var(--color-dark)] border-2 border-gray-200 hover:border-[var(--color-primary)]'
              }`}
            >
              🏏 Tournaments
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg'
                  : 'bg-white text-[var(--color-dark)] border-2 border-gray-200 hover:border-[var(--color-primary)]'
              }`}
            >
              🎬 Videos
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-lg p-12 animate-fadeIn">
            {activeTab === 'certificates' && (
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-[var(--color-dark)]">Donation Certificates</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="group bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border-2 border-blue-200 hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
                    <div className="text-center">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📜</div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">COVID-19 Relief Certificate</h4>
                      <p className="text-gray-600 mb-6 font-semibold">AUD 8,000+ Donation</p>
                      <button 
                        onClick={() => setSelectedPdf('/documents/covid-relief-certificate.pdf')}
                        className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300"
                      >
                        View Certificate
                      </button>
                    </div>
                  </div>
                  <div className="group bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border-2 border-green-200 hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300">
                    <div className="text-center">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🏅</div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">Community Recognition</h4>
                      <p className="text-gray-600 mb-6 font-semibold">Service Award</p>
                      <button 
                        onClick={() => setSelectedPdf('/documents/community-recognition.pdf')}
                        className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tournaments' && (
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-[var(--color-dark)]">Tournament Highlights</h3>
                
                {/* Featured: Fan Fest 2024 with Brett Lee */}
                <div className="relative group bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-accent)] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-[var(--color-accent)]">
                  <div className="absolute inset-0 opacity-10 bg-pattern"></div>
                  <div className="relative z-10 p-12 md:p-16">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-1 text-white">
                        <div className="inline-block mb-4 px-4 py-2 bg-white/20 rounded-full backdrop-blur">
                          <p className="text-sm font-bold uppercase tracking-wider">⭐ FEATURED EVENT</p>
                        </div>
                        <h4 className="text-5xl font-black mb-4">Fan Fest 2024</h4>
                        <p className="text-3xl font-bold text-[var(--color-accent)] mb-6">with Brett Lee</p>
                        <p className="text-lg text-white/90 mb-6 leading-relaxed max-w-2xl">
                          An unprecedented cricket celebration featuring legendary fast bowler Brett Lee! Our Fan Fest 2024 showcased elite cricket, incredible community engagement, and unforgettable moments with one of cricket's greatest icons.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button className="px-8 py-3 bg-white text-[var(--color-primary)] font-black rounded-lg hover:bg-gray-100 hover:shadow-lg transition-all duration-300 uppercase tracking-wider">
                            View Photos
                          </button>
                          <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300">
                            Learn More
                          </button>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-7xl animate-bounce">🏏</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] h-56 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="text-7xl">🏏</div>
                    </div>
                    <div className="p-8">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">Tournament 2020</h4>
                      <p className="text-gray-600 mb-6 leading-relaxed">Historic record-breaking attendance with thrilling championship-caliber competition and passionate community participation.</p>
                      <button className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-all duration-300">
                        View Photos
                      </button>
                    </div>
                  </div>
                  <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <div className="bg-gradient-to-br from-[var(--color-primary-2)] to-[var(--color-accent)] h-56 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="text-7xl">🎯</div>
                    </div>
                    <div className="p-8">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">Tournament 2022</h4>
                      <p className="text-gray-600 mb-4">Unprecedented community mobilization showcasing elite sportsmanship and unity</p>
                      <button className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-all duration-300">
                        View Photos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-[var(--color-dark)]">Video Highlights</h3>
                {videos.length > 0 && videos.some(v => v.youtubeId) ? (
                  <div className="space-y-8">
                    {videos.map((video, idx) => (
                      video.youtubeId && (
                        <div key={idx} className="animate-slideUp">
                          <div className="bg-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                            <div className="relative w-full pb-[56.25%]">
                              <iframe
                                className="absolute top-0 left-0 w-full h-full group-hover:scale-105 transition-transform duration-300"
                                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                            <div className="p-6 bg-white">
                              <h4 className="text-xl font-bold text-gray-800 mb-2">{video.title}</h4>
                              <p className="text-gray-600 leading-relaxed">{video.description}</p>
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-12 text-center border-2 border-blue-200">
                    <p className="text-gray-600 text-lg">More videos coming soon!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-[var(--color-dark)] to-[var(--color-primary)]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Join Our Community</h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Whether you're a seasoned cricketer or just starting out, there's a place for you in the CPS Cricket Club. Join us and be part of something special.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register-interest" className="bg-[var(--color-accent)] text-[var(--color-dark)] px-10 py-4 rounded-full font-black hover:shadow-lg hover:scale-105 transform transition-all duration-200 text-lg uppercase tracking-wider hover:bg-[#FFC939]">
              Register Now
            </a>
            <a href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[var(--color-dark)] transition-all duration-200 text-lg">
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </main>

    {/* PDF Viewer Modal */}
    {selectedPdf && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-6 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">Certificate</h3>
            <button
              onClick={() => setSelectedPdf(null)}
              className="text-white text-3xl font-bold hover:opacity-70 transition-opacity"
            >
              ✕
            </button>
          </div>
          <div className="p-6 overflow-auto max-h-[calc(90vh-100px)]">
            <iframe
              src={selectedPdf}
              className="w-full h-[600px] rounded-lg border-2 border-gray-200"
              title="Certificate PDF"
            />
            <div className="mt-6 flex gap-4 justify-center">
              <a
                href={selectedPdf}
                download
                className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300"
              >
                Download PDF
              </a>
              <button
                onClick={() => setSelectedPdf(null)}
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
