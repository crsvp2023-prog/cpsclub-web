"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { logAnalyticsEvent } from "@/app/lib/analytics";

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await logAnalyticsEvent("button_click", "logout", user?.id);
    await logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--color-dark)] mb-2">
              Welcome, {user?.name}! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              Manage your profile and cricket activities
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* User Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-2)] rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Account Name</p>
                <p className="text-lg font-bold text-[var(--color-dark)]">
                  {user?.name}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                ✉️
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-bold text-[var(--color-dark)] truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl">
                ✓
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">
              Profile Settings
            </h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg font-bold hover:bg-blue-50 transition-colors">
                Edit Profile
              </button>
              <button className="w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors">
                Change Password
              </button>
              <button className="w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors">
                Privacy Settings
              </button>
            </div>
          </div>

          {/* Matches Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">
              My Matches
            </h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg font-bold hover:bg-blue-50 transition-colors">
                View Registered Matches
              </button>
              <button className="w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors">
                View Match History
              </button>
              <button className="w-full px-4 py-3 border-2 border-gray-300 text-[var(--color-dark)] rounded-lg font-bold hover:bg-gray-50 transition-colors">
                Register for Match
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">
              Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <p className="text-2xl font-bold text-[var(--color-primary)]">0</p>
                <p className="text-sm text-gray-600">Matches Played</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600">Runs Scored</p>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6">
              Analytics
            </h2>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">View detailed website analytics and user engagement metrics</p>
              <Link
                href="/analytics"
                className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white rounded-lg font-bold hover:shadow-lg transition-shadow"
              >
                📊 View Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white rounded-lg font-bold hover:shadow-lg transition-shadow"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
