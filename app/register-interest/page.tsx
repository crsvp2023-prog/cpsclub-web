'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { AuthContext } from '@/app/context/AuthContext';

export default function RegisterInterestPage() {
  const router = useRouter();
  const context = useContext(AuthContext);
  const [isRegisteredMember, setIsRegisteredMember] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Match details
  const upcomingMatch = {
    date: '10 Jan 2026',
    time: '1:00 PM',
    venue: 'Primrose Oval',
    type: 'One Day',
    opponent: 'Old Ignatians (Taronga)',
  };

  useEffect(() => {
    checkMemberStatus();
  }, [context]);

  const checkMemberStatus = async () => {
    try {
      if (!context?.user?.email) {
        setIsRegisteredMember(false);
        setLoading(false);
        return;
      }

      // Check if user is registered as a member
      const response = await fetch(`/api/members/check?email=${encodeURIComponent(context.user.email)}`);
      const data = await response.json();
      setIsRegisteredMember(data.isRegistered || false);
    } catch (error) {
      console.error('Error checking member status:', error);
      setIsRegisteredMember(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <section className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // If registered member, show availability poll
  if (isRegisteredMember) {
    return <MatchAvailabilityPoll upcomingMatch={upcomingMatch} userEmail={context?.user?.email || ''} />;
  }

  // If not registered, show member registration
  return <MemberRegistration upcomingMatch={upcomingMatch} />;
}

// Member Registration Component
function MemberRegistration({ upcomingMatch }: { upcomingMatch: any }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Player',
    experience: 'Beginner',
    comments: '',
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
      const response = await fetch('/api/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          role: 'Player',
          experience: 'Beginner',
          comments: '',
        });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
          <h1 className="text-5xl font-bold mb-4">Join Our Cricket Club</h1>
          <p className="text-xl text-blue-100">
            Register as a member to participate in matches and events
          </p>
        </div>
      </section>

      {/* Match Preview */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Upcoming Match</h2>
          <div className="bg-white border-l-4 border-green-500 p-6 rounded shadow">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-gray-600 text-sm">Date</p>
                <p className="font-bold text-gray-900">{upcomingMatch.date}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Time</p>
                <p className="font-bold text-gray-900">{upcomingMatch.time}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Venue</p>
                <p className="font-bold text-gray-900">{upcomingMatch.venue}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Type</p>
                <p className="font-bold text-gray-900">{upcomingMatch.type}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700"><strong>Opponent:</strong> {upcomingMatch.opponent}</p>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Member Registration</h2>
            <p className="text-gray-600 mb-6">
              Complete your registration to join the club and participate in matches.
            </p>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                ✓ Registration successful! Check your email for confirmation.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                ✗ Registration failed. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  What's your role?
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Player">Player</option>
                  <option value="Coach">Coach</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Supporter">Supporter</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Experience Level
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Additional Comments
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Any additional information you'd like to share?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register as Member'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Match Availability Poll Component
function MatchAvailabilityPoll({ upcomingMatch, userEmail }: { upcomingMatch: any; userEmail: string }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    availability: 'available',
    preferredRole: 'batsman',
    comments: '',
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
      const response = await fetch('/api/match-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          matchDate: upcomingMatch.date,
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Error submitting availability:', error);
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
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Match Availability Poll</h1>
          <p className="text-xl text-green-100">
            Let us know your availability for the upcoming match
          </p>
        </div>
      </section>

      {/* Match Details */}
      <section className="bg-blue-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Upcoming Match Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
              <h3 className="font-bold text-lg mb-3 text-gray-800">Match Information</h3>
              <div className="space-y-2">
                <p><strong>Date:</strong> {upcomingMatch.date}</p>
                <p><strong>Time:</strong> {upcomingMatch.time}</p>
                <p><strong>Venue:</strong> {upcomingMatch.venue}</p>
                <p><strong>Format:</strong> {upcomingMatch.type}</p>
                <p><strong>Opponent:</strong> {upcomingMatch.opponent}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
              <h3 className="font-bold text-lg mb-3 text-gray-800">How Team Selection Works</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Based on your availability and preferred role</li>
                <li>✓ We prioritize consistent performers</li>
                <li>✓ Balance between batting and bowling</li>
                <li>✓ Notifications sent to selected players</li>
                <li>✓ Final 11 confirmed 48 hours before match</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Your Availability</h2>
            <p className="text-gray-600 mb-6">
              Help us plan the team by telling us your availability and preferred role.
            </p>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                ✓ Your availability has been recorded. Thank you!
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                ✗ Failed to submit. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Are you available? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="available"
                      checked={formData.availability === 'available'}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-gray-700">✓ Yes, I'm available</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="maybe"
                      checked={formData.availability === 'maybe'}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-gray-700">? Maybe, I'll confirm later</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="unavailable"
                      checked={formData.availability === 'unavailable'}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4"
                    />
                    <span className="text-gray-700">✗ Not available</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Preferred Role
                </label>
                <select
                  name="preferredRole"
                  value={formData.preferredRole}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="batsman">Batsman</option>
                  <option value="bowler">Bowler</option>
                  <option value="all-rounder">All-rounder</option>
                  <option value="wicketkeeper">Wicketkeeper</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Additional Comments
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Any injuries, notes, or special requirements?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Availability'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
