"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "player" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Registration submitted:", form);
    setSubmitted(true);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold mb-6">Register for 2026</h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="0400 000 000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">I am a</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="player">Player</option>
              <option value="volunteer">Volunteer</option>
              <option value="coach">Coach</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Submit Registration
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-md bg-green-50 p-6">
          <h2 className="text-xl font-semibold">Thanks — you’re registered!</h2>
          <p className="mt-2 text-gray-700">We’ll contact you with next steps.</p>
        </div>
      )}
    </main>
  );
}
