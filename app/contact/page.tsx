'use client';

import { useState } from 'react';
import { contactConfig } from '@/app/config/contact';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Send email via API
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubmitted(true);
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
          setTimeout(() => {
            setSubmitted(false);
          }, 5000);
        } else {
          setError(data.error || 'Failed to send message. Please try again.');
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Failed to send message. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0056FF] via-[#0080FF] to-[#00B8FF]">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="inline-flex flex-col items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/90 shadow-lg shadow-blue-500/30 border border-white/60">
            <span className="text-lg">📩</span>
            <p className="text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-[var(--color-primary)]">
              Get in touch
            </p>
          </div>
          <p className="text-xs sm:text-sm text-white/90 max-w-md">
            Tell us how we can help — membership, events, coaching or anything else.
          </p>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-dark)] mb-6 leading-tight">
          Contact <span className="text-[var(--color-primary)]">CPS Club</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Have questions or want to get involved? Reach out to our team. We're here to help and would love to hear from you.
        </p>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-6 pb-20 bg-white/95 rounded-3xl shadow-2xl border border-white/40 backdrop-blur-sm">
        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: 'Location',
              content: contactConfig.location.name,
              subtext: `${contactConfig.location.city}, ${contactConfig.location.state} ${contactConfig.location.postcode}`,
              icon: 'location'
            },
            {
              title: 'Phone',
              content: contactConfig.phone.main,
              subtext: contactConfig.phone.hours,
              icon: 'phone'
            },
            {
              title: 'Email',
              content: contactConfig.emails.info,
              subtext: contactConfig.responseTime,
              icon: 'email'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-2xl">
                  {item.icon === 'location' && <span>📍</span>}
                  {item.icon === 'phone' && <span>📞</span>}
                  {item.icon === 'email' && <span>✉️</span>}
                </div>
                <h3 className="text-xl font-bold text-[var(--color-dark)]">
                  {item.title}
                </h3>
              </div>
              <p className="text-lg font-semibold text-[var(--color-primary)] mb-2">
                {item.content}
              </p>
              <p className="text-gray-600 text-sm">
                {item.subtext}
              </p>
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-[var(--color-dark)] mb-3">Send us a Message</h2>

              <p className="text-sm text-gray-600 mb-6">
                Share a few details and we&apos;ll direct your enquiry to the right team. We usually respond within{' '}
                <span className="font-semibold">{contactConfig.responseTime}</span>.
              </p>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold">Message sent successfully!</p>
                  <p className="text-green-700 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-red-800 font-semibold">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-dark)] mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-dark)] mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all text-black"
                    />
                  </div>
                </div>

                {/* Phone and Subject */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-dark)] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+61 2 XXXX XXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-dark)] mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all text-black"
                    >
                      <option value="">Select a subject</option>
                      <option value="Membership Inquiry">Membership Inquiry</option>
                      <option value="Event Inquiry">Event Inquiry</option>
                      <option value="Coaching">Coaching</option>
                      <option value="Sponsorship">Sponsorship</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-dark)] mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please share your message or inquiry..."
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all resize-none text-black"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Side Info */}
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] rounded-2xl p-8 text-white h-fit">
            <h3 className="text-2xl font-bold mb-8">Why Reach Out?</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold mb-2">Quick Response</h4>
                <p className="text-sm opacity-90">Reply within 24 hours</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Expert Support</h4>
                <p className="text-sm opacity-90">Professional team ready to assist</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Personalized Solutions</h4>
                <p className="text-sm opacity-90">Tailored help for your needs</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Community Driven</h4>
                <p className="text-sm opacity-90">Part of a growing cricket community</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-8 border-t border-white/30">
              <p className="text-sm font-bold mb-4">Follow Us</p>
              <div className="flex gap-3">
                <a
                  href={contactConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-lg flex items-center justify-center font-bold text-blue-700 transition-all hover:scale-110"
                >
                  f
                </a>
                <a
                  href={contactConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-12 h-12 bg-white/20 hover:bg-white/40 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <span className="text-lg">📷</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
