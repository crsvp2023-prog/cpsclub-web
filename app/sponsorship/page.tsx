'use client';

import { useState } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Link from 'next/link';

interface SponsorshipTier {
  name: string;
  price: string;
  description: string;
  benefits: string[];
  highlighted?: boolean;
}

const sponsorshipTiers: SponsorshipTier[] = [
  {
    name: 'Silver',
    price: '$2,500',
    description: 'Perfect for emerging brands looking to build awareness',
    benefits: [
      'Logo on website (footer)',
      'Social media mentions (6+ posts)',
      'Event attendance (1 representative)',
      'Email newsletter recognition',
      'Certificate of partnership',
    ],
  },
  {
    name: 'Gold',
    price: '$5,000',
    description: 'Ideal for established businesses seeking visibility',
    benefits: [
      'Logo on website (prominent placement)',
      'Social media features (10+ posts)',
      'Event sponsorship package',
      'Email newsletter features (3 mentions)',
      'Networking opportunities with members',
      'Annual partnership report',
      'Premium event booth',
    ],
    highlighted: true,
  },
  {
    name: 'Platinum',
    price: '$10,000',
    description: 'Maximum exposure for title and major sponsors',
    benefits: [
      'Title/major sponsorship branding',
      'Premium website placement (homepage)',
      'Exclusive social media campaign',
      'Event title naming rights',
      'VIP networking events',
      'Custom content collaboration',
      'Monthly performance reports',
      'Dedicated account manager',
      'Logo on match jerseys/banners',
    ],
  },
];

const roiMetrics = [
  { metric: 'Monthly Website Visitors', value: '5,000+', description: 'Growing audience reach' },
  { metric: 'Social Media Followers', value: '8,000+', description: 'Across all platforms' },
  { metric: 'Active Members', value: '150+', description: 'Engaged cricket community' },
  { metric: 'Email Subscribers', value: '2,000+', description: 'Regular newsletter engagement' },
];

export default function SponsorshipPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    tierInterest: 'Gold',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/sponsorship/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          tierInterest: 'Gold',
          message: '',
        });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Sponsorship Opportunities</h1>
          <p className="text-xl text-blue-100">
            Partner with CPS Club and reach an engaged cricket community
          </p>
        </div>
      </section>

      {/* Why Sponsor */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Sponsor CPS Club?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {roiMetrics.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{item.value}</div>
                <div className="font-semibold text-lg mb-2">{item.metric}</div>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Sponsorship Packages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {sponsorshipTiers.map((tier, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden shadow-lg transition transform hover:scale-105 ${
                  tier.highlighted
                    ? 'border-4 border-green-500 bg-gradient-to-br from-white to-green-50 md:scale-105'
                    : 'bg-white'
                }`}
              >
                {tier.highlighted && (
                  <div className="bg-green-500 text-white text-center py-2 font-bold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">{tier.name}</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-4">{tier.price}</div>
                  <p className="text-gray-600 mb-6">{tier.description}</p>

                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-3 font-bold">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 rounded-lg font-semibold transition ${
                    tier.highlighted
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    Choose Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What You Get</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Brand Visibility</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Logo placement on high-traffic website pages</li>
                <li>• Regular social media features and mentions</li>
                <li>• Email newsletter recognition to 2000+ subscribers</li>
                <li>• Event sponsorship branding (banners, jerseys)</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-green-600">Community Engagement</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Direct access to 150+ active club members</li>
                <li>• VIP networking events and exclusive functions</li>
                <li>• Partnership in community-building initiatives</li>
                <li>• Testimonials and success stories</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Inquiry Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-2">Ready to Partner With Us?</h2>
          <p className="text-center text-gray-600 mb-8">
            Fill out the form below and our team will get back to you shortly.
          </p>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                Thank you! We'll be in touch soon.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                Something went wrong. Please try again.
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="contactName"
                placeholder="Contact Name"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Sponsorship Tier of Interest
              </label>
              <select
                name="tierInterest"
                value={formData.tierInterest}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Silver</option>
                <option>Gold</option>
                <option>Platinum</option>
                <option>Custom Package</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Tell us about your company and sponsorship goals..."
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
          <p className="mb-2">Email: crsvp.2023@gmail.com</p>
          <p className="mb-6">We'd love to discuss how we can grow together</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900 font-bold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Get in Touch 
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
