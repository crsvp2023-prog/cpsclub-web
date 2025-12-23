'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would normally send the data to a backend
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 py-12 text-center animate-slideUp">
        <div className="inline-block px-4 py-2 bg-[var(--color-accent)]/20 rounded-full border-2 border-[var(--color-accent)] mb-4 backdrop-blur-sm">
          <p className="text-sm font-bold text-[var(--color-accent)]">💬 GET IN TOUCH</p>
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-lg">
          Contact <span className="text-[var(--color-accent)]">Us</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Have questions? Want to join our cricket community? We'd love to hear from you. Get in touch with our team today!
        </p>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          {[
            {
              icon: '📍',
              title: 'Location',
              details: ['Chatswood Premier Sports Club', 'Chatswood, NSW 2067'],
              color: 'from-blue-500 to-blue-600',
              bgGradient: 'from-blue-50 to-blue-100'
            },
            {
              icon: '📞',
              title: 'Phone',
              details: ['+61 2 XXXX XXXX', 'Available 9AM - 6PM'],
              color: 'from-green-500 to-green-600',
              bgGradient: 'from-green-50 to-green-100'
            },
            {
              icon: '✉️',
              title: 'Email',
              details: ['crsvp.2023@gmail.com', 'Response within 24 hours'],
              color: 'from-orange-500 to-orange-600',
              bgGradient: 'from-orange-50 to-orange-100'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`group relative bg-gradient-to-br ${item.bgGradient} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border-2 border-white/50 overflow-hidden`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Background gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Icon with floating animation */}
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mb-6 animate-float`}>
                  <span className="text-4xl">{item.icon}</span>
                </div>
                
                {/* Title with vibrant color */}
                <h3 className={`text-2xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-4`}>
                  {item.title}
                </h3>
                
                {/* Details */}
                {item.details.map((detail, i) => (
                  <p key={i} className="text-gray-700 font-semibold mb-2 group-hover:text-gray-900 transition-colors">
                    {detail}
                  </p>
                ))}
                
                {/* Bottom accent line */}
                <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500 mt-6`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
              <h2 className="text-3xl font-bold text-[var(--color-dark)] mb-8">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-xl">
                  <p className="text-green-800 font-bold text-lg">✓ Message sent successfully!</p>
                  <p className="text-green-700">We'll get back to you soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Phone and Subject */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+61 2 XXXX XXXX"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 outline-none transition-all font-medium"
                    >
                      <option value="">Select a subject</option>
                      <option value="Join Membership">Join Membership</option>
                      <option value="Event Inquiry">Event Inquiry</option>
                      <option value="Coaching">Coaching</option>
                      <option value="Sponsorship">Sponsorship</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/20 outline-none transition-all font-medium resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[var(--color-primary-2)] to-[var(--color-accent)] text-white font-black rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 uppercase tracking-wide text-lg"
                >
                  Send Message 🚀
                </button>
              </form>
            </div>
          </div>

          {/* Side Info */}
          <div className="bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-2)] rounded-2xl p-8 text-white h-fit">
            <h3 className="text-2xl font-black mb-6">Why Contact Us?</h3>
            <div className="space-y-5">
              <div className="flex gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-bold">Quick Response</p>
                  <p className="text-sm opacity-90">We reply within 24 hours</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-bold">Expert Team</p>
                  <p className="text-sm opacity-90">Cricket professionals here to help</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-bold">Personalized Help</p>
                  <p className="text-sm opacity-90">Solutions tailored to your needs</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">💪</span>
                <div>
                  <p className="font-bold">Community Support</p>
                  <p className="text-sm opacity-90">Join thousands of cricket lovers</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-8 border-t border-white/30">
              <p className="text-sm font-bold mb-4 uppercase tracking-wide">Follow Us</p>
              <div className="flex gap-3">
                <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-lg flex items-center justify-center font-bold text-lg transition-all hover:scale-110">📱</a>
                <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-lg flex items-center justify-center font-bold text-lg transition-all hover:scale-110">🐦</a>
                <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-lg flex items-center justify-center font-bold text-lg transition-all hover:scale-110">📘</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
