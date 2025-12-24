"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logAnalyticsEvent } from "@/app/lib/analytics";
import { AuthContext } from "@/app/context/AuthContext";
import { 
  isValidEmail, 
  isValidPhone 
} from "@/app/lib/validation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Player",
    experience: "Beginner",
    matchInterest: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const context = useContext(AuthContext);
  const signup = context?.signup;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate form fields
    if (!formData.name || !formData.email) {
      setError("Name and email are required");
      setLoading(false);
      return;
    }

    // Validate email format
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Validate phone format if provided
    if (formData.phone && !isValidPhone(formData.phone)) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      console.log("Starting registration with email:", formData.email);
      
      if (!signup) {
        setError("Authentication service not available");
        setLoading(false);
        return;
      }

      // Create user with Firebase Auth
      const user = await signup(formData.email, formData.name, formData.phone, formData.role);
      
      console.log("Signup returned user:", user);
      
      if (!user) {
        setError("Registration failed. Please try again.");
        await logAnalyticsEvent("form_submit", "registration_failed");
        setLoading(false);
        return;
      }

      // Save additional user data via API
      console.log("Saving user data to Firestore via API with UID:", user.uid);
      
      const apiResponse = await fetch('/api/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          experience: formData.experience,
          matchInterest: formData.matchInterest,
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Failed to save registration");
      }

      const apiData = await apiResponse.json();
      console.log("Registration saved:", apiData);
      }, { merge: true });

      console.log("User data saved successfully");

      // Log successful registration
      await logAnalyticsEvent("form_submit", "registration", user.uid);

      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      console.error("Registration error:", err);
      setError(message);
      await logAnalyticsEvent("form_submit", "registration_failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-extrabold text-[var(--color-dark)] mb-4">
            Welcome to CPS Club!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your registration is complete. Redirecting to your dashboard...
          </p>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[var(--color-dark)] mb-2">
            Join CPS Club 🏏
          </h1>
          <p className="text-lg text-gray-600">
            Register to become part of our cricket community
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[var(--color-primary)] focus:outline-none transition-colors text-black"
                placeholder="John Doe"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[var(--color-primary)] focus:outline-none transition-colors text-black"
                placeholder="you@example.com"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-black mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[var(--color-primary)] focus:outline-none transition-colors text-black"
                placeholder="(555) 000-0000"
              />
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-black mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[var(--color-primary)] focus:outline-none transition-colors text-black"
              >
                <option>Player</option>
                <option>Coach</option>
                <option>Volunteer</option>
                <option>Supporter</option>
              </select>
            </div>

            {/* Experience Field */}
            <div>
              <label htmlFor="experience" className="block text-sm font-semibold text-black mb-2">
                Experience Level
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[var(--color-primary)] focus:outline-none transition-colors text-black"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Professional</option>
              </select>
            </div>

            {/* Match Interest Field */}
            <div>
              <label htmlFor="matchInterest" className="block text-sm font-semibold text-black mb-2">
                Interested In
              </label>
              <textarea
                id="matchInterest"
                name="matchInterest"
                value={formData.matchInterest}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[var(--color-primary)] focus:outline-none transition-colors resize-none text-black"
                placeholder="e.g., Test matches, T20, coaching opportunities..."
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)] text-white px-6 py-3 rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register Now"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-2)]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
