'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  comments: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: any;
}

export default function AdminRegisterInterestPage() {
  const context = useContext(AuthContext);
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!context?.isAuthenticated) {
      router.push('/login');
      return;
    }

    // For now, allow logged-in users. In production, add role-based access control
    fetchRegistrations();
  }, [context, router]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/register-interest');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/register-interest/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRegistrations(regs =>
          regs.map(r => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;

    try {
      const response = await fetch(`/api/admin/register-interest/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistrations(regs => regs.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesFilter = filter === 'all' || reg.status === filter;
    const matchesSearch =
      reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!context?.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Register Interest Submissions</h1>
          <p className="text-blue-100">Manage and review member registration inquiries</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow py-12">
        <div className="container mx-auto px-4">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Registrations</p>
              <p className="text-3xl font-bold text-blue-600">{registrations.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {registrations.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {registrations.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-600">
                {registrations.filter(r => r.status === 'rejected').length}
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Filter by Status</label>
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Registrations</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Registrations Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-600">Loading registrations...</div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="p-8 text-center text-gray-600">No registrations found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Experience</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Submitted</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map(reg => (
                      <tr key={reg.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{reg.fullName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{reg.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{reg.phone || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{reg.role}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{reg.experience}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(reg.status)}`}>
                            {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {reg.submittedAt?.toDate?.().toLocaleDateString() || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(reg.id, 'approved')}
                              disabled={reg.status === 'approved'}
                              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(reg.id, 'rejected')}
                              disabled={reg.status === 'rejected'}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => deleteRegistration(reg.id)}
                              className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Expandable Details */}
          {filteredRegistrations.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Detailed Submissions</h3>
              <div className="space-y-4">
                {filteredRegistrations.map(reg => (
                  <details
                    key={reg.id}
                    className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
                  >
                    <summary className="font-semibold text-gray-800">
                      {reg.fullName} - {reg.email}
                    </summary>
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <p>
                        <span className="font-semibold">Phone:</span> {reg.phone || 'Not provided'}
                      </p>
                      <p>
                        <span className="font-semibold">Role:</span> {reg.role}
                      </p>
                      <p>
                        <span className="font-semibold">Experience:</span> {reg.experience}
                      </p>
                      <p>
                        <span className="font-semibold">Comments:</span>
                      </p>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {reg.comments || 'No additional comments'}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
