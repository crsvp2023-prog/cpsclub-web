'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase-admin';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  subscribedAt: any;
  status: string;
}

export default function NewsletterSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'newsletter_subscribers'),
          orderBy('subscribedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const data: Subscriber[] = [];
        
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            email: doc.data().email,
            firstName: doc.data().firstName,
            subscribedAt: doc.data().subscribedAt,
            status: doc.data().status,
          });
        });

        setSubscribers(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch subscribers');
        console.error('Error fetching subscribers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full border border-blue-300">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider">Admin Dashboard</p>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Newsletter Subscribers</h1>
          <p className="text-lg text-gray-600">
            View and manage all newsletter subscribers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-8">
            <p className="text-gray-600 font-semibold mb-2">Total Subscribers</p>
            <p className="text-4xl font-bold text-blue-600">{subscribers.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8">
            <p className="text-gray-600 font-semibold mb-2">Active Subscribers</p>
            <p className="text-4xl font-bold text-green-600">
              {subscribers.filter((s) => s.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8">
            <p className="text-gray-600 font-semibold mb-2">Joined This Month</p>
            <p className="text-4xl font-bold text-purple-600">
              {subscribers.filter((s) => {
                const date = s.subscribedAt?.toDate ? s.subscribedAt.toDate() : new Date(s.subscribedAt);
                const now = new Date();
                return (
                  date.getMonth() === now.getMonth() && 
                  date.getFullYear() === now.getFullYear()
                );
              }).length}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-700"
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg">Loading subscribers...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-600 text-lg font-semibold">{error}</p>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg">
                {searchTerm ? 'No subscribers match your search' : 'No subscribers yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Subscribed Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map((subscriber, index) => (
                    <tr
                      key={subscriber.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {subscriber.firstName.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-semibold text-gray-900">
                            {subscriber.firstName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 break-all">{subscriber.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                          {subscriber.status === 'active' ? '✓ Active' : subscriber.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm">
                          {formatDate(subscriber.subscribedAt)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredSubscribers.length > 0 && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-gray-700">
              Showing <span className="font-bold text-blue-600">{filteredSubscribers.length}</span> of{' '}
              <span className="font-bold text-blue-600">{subscribers.length}</span> subscribers
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
