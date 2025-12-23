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
    <main className="min-h-screen bg-gradient-to-b from-[var(--color-dark)] via-blue-50 to-green-50 pt-20">
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
      `}</style>

      {/* Hero Section */}
      <section className="relative py-16 px-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-slideUp">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">About CPS Club</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Champions united by excellence, transforming communities through cricket while driving
              meaningful change and inspiring healthier, stronger futures for all.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-12 animate-fadeIn">
            <h2 className="text-4xl font-black text-[var(--color-dark)] mb-8">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We are a powerhouse of passionate, forward-thinking individuals united to empower every person to thrive,
              lead authentically, and foster genuine connections within an inclusive, vibrant community dedicated to wellness
              and mutual success.
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] mb-6" />
            <p className="text-lg text-gray-700 leading-relaxed">
              We successfully orchestrated 2 transformative cricket tournaments, fueling community vitality and wellness.
              Standing firm in our commitment to social impact, we mobilized AUD 8,000+ for COVID-19 relief—demonstrating
              our unwavering dedication to strengthening the communities we serve.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements Timeline */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-[var(--color-dark)] mb-16 text-center">Our Achievements</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="animate-slideUp text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="text-6xl mb-4">{achievement.icon}</div>
                  <p className="text-white/80 text-sm font-bold mb-2">{achievement.year}</p>
                  <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COVID Relief & Certificates Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-[var(--color-dark)] mb-12 text-center">Community Impact</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Donation Card */}
            <div className="animate-slideUp bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-8">
                <div className="text-6xl mb-4">💚</div>
                <h3 className="text-2xl font-bold text-white">COVID-19 Relief</h3>
              </div>
              <div className="p-8">
                <p className="text-gray-700 text-lg font-bold mb-4">AUD 8,000+ Mobilized for Impact</p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  During the darkest hours of the pandemic, our community united with unwavering resolve to mobilize over 8,000 dollars in critical relief support. We championed real, lasting change when it mattered most.
                </p>
                <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                  <p className="text-sm text-gray-600 font-semibold">Certificate of Donation Available</p>
                  <p className="text-xs text-gray-500 mt-2">View our official donation certificate documenting our contribution to the community during COVID-19.</p>
                </div>
              </div>
            </div>

            {/* Tournaments Card */}
            <div className="animate-slideUp bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '0.1s' }}>
              <div className="bg-gradient-to-r from-[var(--color-primary-2)] to-[var(--color-accent)] p-8">
                <div className="text-6xl mb-4">🏏</div>
                <h3 className="text-2xl font-bold text-white">Cricket Tournaments</h3>
              </div>
              <div className="p-8">
                <p className="text-gray-700 text-lg font-bold mb-4">2 Game-Changing Tournaments</p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We orchestrated 2 landmark cricket tournaments that electrified the region, driving unprecedented engagement and promoting dynamic wellness. These transformative events united passionate competitors and inspired a generation of cricket excellence.
                </p>
                <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                  <p className="text-sm text-gray-600 font-semibold">Tournament Highlights Available</p>
                  <p className="text-xs text-gray-500 mt-2">View photos and videos from our tournaments showcasing the excitement and community spirit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Gallery Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-[var(--color-dark)] mb-12 text-center">Gallery & Videos</h2>
          
          {/* Tab Navigation */}
          <div className="flex justify-center gap-4 mb-12 border-b-2 border-gray-200 pb-4">
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-8 py-3 font-bold transition-all duration-300 relative ${
                activeTab === 'certificates'
                  ? 'text-[var(--color-primary)] font-black text-lg'
                  : 'text-gray-600 hover:text-[var(--color-primary)]'
              }`}
            >
              📜 Certificates
              {activeTab === 'certificates' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-8 py-3 font-bold transition-all duration-300 relative ${
                activeTab === 'tournaments'
                  ? 'text-[var(--color-primary)] font-black text-lg'
                  : 'text-gray-600 hover:text-[var(--color-primary)]'
              }`}
            >
              🏏 Tournaments
              {activeTab === 'tournaments' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-8 py-3 font-bold transition-all duration-300 relative ${
                activeTab === 'videos'
                  ? 'text-[var(--color-primary)] font-black text-lg'
                  : 'text-gray-600 hover:text-[var(--color-primary)]'
              }`}
            >
              🎬 Videos
              {activeTab === 'videos' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl shadow-xl p-12 animate-fadeIn">
            {activeTab === 'certificates' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-[var(--color-dark)]">Donation Certificates</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-2xl p-8 border-4 border-blue-200 hover:shadow-xl transition-all duration-300">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📜</div>
                      <h4 className="text-lg font-bold text-gray-800 mb-2">COVID-19 Relief Certificate</h4>
                      <p className="text-gray-600 mb-6">AUD 8,000+ Donation Certificate</p>
                      <button 
                        onClick={() => setSelectedPdf('/documents/covid-relief-certificate.pdf')}
                        className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300"
                      >
                        View Certificate
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-8 border-4 border-green-200 hover:shadow-xl transition-all duration-300">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏅</div>
                      <h4 className="text-lg font-bold text-gray-800 mb-2">Community Recognition</h4>
                      <p className="text-gray-600 mb-6">Recognized for community service</p>
                      <button 
                        onClick={() => setSelectedPdf('/documents/community-recognition.pdf')}
                        className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300"
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
                <h3 className="text-2xl font-bold text-[var(--color-dark)]">Tournament Highlights</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] h-48 flex items-center justify-center">
                      <div className="text-6xl">🏏</div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">Tournament 1 - 2020</h4>
                      <p className="text-gray-600 mb-4">Historic record-breaking attendance with thrilling championship-caliber competition</p>
                      <button className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-all duration-300">
                        View Photos
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="bg-gradient-to-br from-[var(--color-primary-2)] to-[var(--color-accent)] h-48 flex items-center justify-center">
                      <div className="text-6xl">🎯</div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">Tournament 2 - 2022</h4>
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
                <h3 className="text-2xl font-bold text-[var(--color-dark)]">Video Highlights</h3>
                {videos.length > 0 && videos.some(v => v.youtubeId) ? (
                  <div className="space-y-8">
                    {videos.map((video, idx) => (
                      video.youtubeId && (
                        <div key={idx} className="flex justify-center">
                          <div className="w-full max-w-2xl rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="relative w-full pb-[56.25%] bg-gray-900">
                              <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                            <div className="p-6 bg-white">
                              <h4 className="text-lg font-bold text-gray-800 mb-2">{video.title}</h4>
                              <p className="text-gray-600">{video.description}</p>
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 rounded-2xl p-8 border-4 border-gray-200 text-center">
                      <div className="text-6xl mb-4">🎬</div>
                      <h4 className="text-lg font-bold text-gray-800 mb-2">Cricket Tournament Highlights</h4>
                      <p className="text-gray-600 mb-6">Best moments from our tournaments</p>
                      <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                        <p className="text-sm text-gray-700 font-semibold">Add YouTube Link</p>
                        <p className="text-xs text-gray-600 mt-2">YouTube video ID to be added</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-8 border-4 border-gray-200 text-center">
                      <div className="text-6xl mb-4">▶️</div>
                      <h4 className="text-lg font-bold text-gray-800 mb-2">Community Stories</h4>
                      <p className="text-gray-600 mb-6">Inspiring stories from our members</p>
                      <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                        <p className="text-sm text-gray-700 font-semibold">Add YouTube Link</p>
                        <p className="text-xs text-gray-600 mt-2">YouTube video ID to be added</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-6">Join the Movement</h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Become part of a revolutionary community redefining excellence through cricket, championing wellness,
            and catalyzing transformative social impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-[var(--color-primary)] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get In Touch
            </a>
            <a
              href="/events"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-300"
            >
              View Events
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
