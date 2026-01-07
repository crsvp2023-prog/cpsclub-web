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

  const ADMIN_EMAIL = 'crsvp.2023@gmail.com';
  const isAdmin = (context?.user?.email || '').trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!context?.isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isAdmin) {
      router.push('/');
      return;
    }

    fetchRegistrations();
  }, [context?.isAuthenticated, isAdmin, router]);

  if (!context?.isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[var(--color-dark)] via-blue-50 to-green-50 pt-20 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page. Admin access required.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:shadow-lg transition-all"
          >
            Go Home
          </button>
        </div>
      </main>
    );
  }

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

      const data = await response.json();

      if (response.ok) {
        setRegistrations(regs =>
          regs.map(r => (r.id === id ? { ...r, status: newStatus } : r))
        );
        alert('Status updated successfully!');
      } else {
        alert(`Error: ${data.error || 'Failed to update status'}\n${data.details || ''}`);
        console.error('Error response:', data);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      alert(`Failed to update status: ${errorMsg}`);
      console.error('Error updating status:', error);
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;

    try {
      const response = await fetch(`/api/admin/register-interest/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setRegistrations(regs => regs.filter(r => r.id !== id));
        alert('Registration deleted successfully!');
      } else {
        alert(`Error: ${data.error || 'Failed to delete registration'}\n${data.details || ''}`);
        console.error('Error response:', data);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      alert(`Failed to delete registration: ${errorMsg}`);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8f9ff] via-white to-[#f0f4ff] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--color-primary)] rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--color-accent)] rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-[var(--color-primary-2)] rounded-full opacity-3 blur-2xl"></div>

      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-2)] to-[var(--color-accent)] text-white py-12 relative z-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Register Interest Submissions</h1>
          <p className="text-white/80">Manage and review member registration inquiries</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow py-12 relative z-10">
        <div className="container mx-auto px-4">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/50">
              <p className="text-gray-600 text-sm font-semibold">Total Registrations</p>
              <p className="text-3xl font-bold text-[var(--color-primary)]">{registrations.length}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/50">
              <p className="text-gray-600 text-sm font-semibold">Pending</p>
              <p className="text-3xl font-bold text-amber-600">
                {registrations.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/50">
              <p className="text-gray-600 text-sm font-semibold">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {registrations.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/50">
              <p className="text-gray-600 text-sm font-semibold">Rejected</p>
              <p className="text-3xl font-bold text-red-600">
                {registrations.filter(r => r.status === 'rejected').length}
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6 border border-white/50">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--color-dark)] font-semibold mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-[var(--color-dark)] font-semibold mb-2">Filter by Status</label>
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-white/50">
            {loading ? (
              <div className="p-8 text-center text-gray-600">Loading registrations...</div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="p-8 text-center text-gray-600">No registrations found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Experience</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Submitted</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map(reg => (
                      <tr key={reg.id} className="border-b hover:bg-blue-50/50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-[var(--color-dark)]">{reg.fullName}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{reg.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{reg.phone || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{reg.role}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{reg.experience}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(reg.status)}`}>
                            {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {reg.submittedAt?.toDate?.().toLocaleDateString() || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(reg.id, 'approved')}
                              disabled={reg.status === 'approved'}
                              className="px-3 py-1 bg-green-500 text-white text-xs rounded font-semibold hover:bg-green-600 disabled:opacity-50 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(reg.id, 'rejected')}
                              disabled={reg.status === 'rejected'}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded font-semibold hover:bg-red-600 disabled:opacity-50 transition"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => deleteRegistration(reg.id)}
                              className="px-3 py-1 bg-gray-500 text-white text-xs rounded font-semibold hover:bg-gray-600 transition"
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
              <h3 className="text-2xl font-bold mb-4 text-[var(--color-dark)]">Detailed Submissions</h3>
              <div className="space-y-4">
                {filteredRegistrations.map(reg => (
                  <details
                    key={reg.id}
                    className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition border border-white/50"
                  >
                    <summary className="font-semibold text-[var(--color-dark)]">
                      {reg.fullName} - {reg.email}
                    </summary>
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                      <p>
                        <span className="font-semibold text-[var(--color-dark)]">Phone:</span> {reg.phone || 'Not provided'}
                      </p>
                      <p>
                        <span className="font-semibold text-[var(--color-dark)]">Role:</span> {reg.role}
                      </p>
                      <p>
                        <span className="font-semibold text-[var(--color-dark)]">Experience:</span> {reg.experience}
                      </p>
                      <p>
                        <span className="font-semibold text-[var(--color-dark)]">Comments:</span>
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
