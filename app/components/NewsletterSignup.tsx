'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, firstName }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: data.message || 'Successfully subscribed!',
        });
        setEmail('');
        setFirstName('');
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to subscribe. Please try again.',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 bg-gradient-to-br from-[var(--color-primary)] via-[#003B82] to-[var(--color-primary-2)] rounded-3xl">
      <div className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/80 to-[var(--color-primary-2)] rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <div className="inline-block px-4 py-2 bg-white/20 rounded-full border border-white/40 mb-6">
              <p className="text-sm font-semibold text-white">Stay Connected</p>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Subscribe to Our <span className="text-yellow-300">Newsletter</span>
            </h2>

            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Get exclusive updates on match schedules, cricket news, sponsor highlights, and member stories delivered to your inbox.
            </p>

            {/* Benefits List */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/20">
                    <span className="text-white font-bold">✓</span>
                  </div>
                </div>
                <p className="text-white/90">Match updates & schedules</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/20">
                    <span className="text-white font-bold">✓</span>
                  </div>
                </div>
                <p className="text-white/90">Sponsor exclusive offers</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/20">
                    <span className="text-white font-bold">✓</span>
                  </div>
                </div>
                <p className="text-white/90">Member achievements & stories</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/20">
                    <span className="text-white font-bold">✓</span>
                  </div>
                </div>
                <p className="text-white/90">Never miss a moment</p>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-[var(--color-dark)] mb-2">
                  First Name (Optional)
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all text-black"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-dark)] mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all text-black"
                />
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    message.type === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      message.type === 'success'
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}
                  >
                    {message.type === 'success' ? '✓' : '✕'} {message.text}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Subscribing...' : 'Subscribe Now'}
              </button>

              {/* Privacy Notice */}
              <p className="text-xs text-gray-500 text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
