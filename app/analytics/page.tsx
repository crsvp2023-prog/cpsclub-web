"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { 
  getPageViews, 
  getTotalClicks, 
  getSponsorClicks, 
  getUniqueUsers 
} from "@/app/lib/analytics";

interface AnalyticsData {
  pageViews: number;
  totalClicks: number;
  sponsorClicks: number;
  uniqueUsers: number;
}

export default function AnalyticsDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViews: 0,
    totalClicks: 0,
    sponsorClicks: 0,
    uniqueUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated]);

  const fetchAnalytics = async () => {
    try {
      const [pageViews, totalClicks, sponsorClicks, uniqueUsers] = await Promise.all([
        getPageViews(),
        getTotalClicks(),
        getSponsorClicks(),
        getUniqueUsers(),
      ]);

      setAnalytics({
        pageViews,
        totalClicks,
        sponsorClicks,
        uniqueUsers,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-[var(--color-dark)] mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Track your website performance and user engagement
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Page Views Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Page Views</h3>
              <span className="text-2xl">👁️</span>
            </div>
            <p className="text-4xl font-bold text-[var(--color-primary)]">
              {analytics.pageViews.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">Total page visits</p>
          </div>

          {/* Total Clicks Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Total Clicks</h3>
              <span className="text-2xl">🖱️</span>
            </div>
            <p className="text-4xl font-bold text-green-600">
              {analytics.totalClicks.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">Button interactions</p>
          </div>

          {/* Sponsor Clicks Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Sponsor Clicks</h3>
              <span className="text-2xl">🤝</span>
            </div>
            <p className="text-4xl font-bold text-orange-600">
              {analytics.sponsorClicks.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">Sponsor interactions</p>
          </div>

          {/* Unique Users Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Unique Users</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-4xl font-bold text-blue-600">
              {analytics.uniqueUsers.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">Unique visitors</p>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={fetchAnalytics}
            className="px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white rounded-lg font-bold hover:shadow-lg transition-all duration-300"
          >
            🔄 Refresh Data
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg font-bold hover:bg-blue-50 transition-all duration-300"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">
            📈 How Analytics Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-primary)] mb-3">
                📊 Metrics Tracked
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>✓ Page views (footfalls/visits)</li>
                <li>✓ Button clicks</li>
                <li>✓ Sponsor link clicks</li>
                <li>✓ Form submissions</li>
                <li>✓ Login/registration events</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-600 mb-3">
                🎯 What to Do Next
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>✓ Share your analytics with team</li>
                <li>✓ Identify popular content</li>
                <li>✓ Improve sponsor engagement</li>
                <li>✓ Optimize user experience</li>
                <li>✓ Track marketing campaigns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
