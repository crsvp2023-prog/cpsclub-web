'use client';

import { useState } from 'react';

// Lazy import to avoid SSR issues
let db: any = null;
let collection: any = null;
let addDoc: any = null;
let serverTimestamp: any = null;

const initFirebase = async () => {
  if (!db) {
    try {
      const firebaseModule = await import('../lib/firebase');
      const firestoreModule = await import('firebase/firestore');
      db = firebaseModule.db;
      collection = firestoreModule.collection;
      addDoc = firestoreModule.addDoc;
      serverTimestamp = firestoreModule.serverTimestamp;
    } catch (error) {
      console.error('Failed to load Firebase:', error);
    }
  }
};

interface RegistrationInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: string;
}

export default function RegistrationInterestModal({ isOpen, onClose, program }: RegistrationInterestModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await initFirebase();
      
      if (!db || !addDoc || !collection || !serverTimestamp) {
        throw new Error('Firebase not initialized');
      }

      // Save to Firestore
      await addDoc(collection(db, 'registration-interests'), {
        program,
        email: email || 'not-provided',
        name: name || 'not-provided',
        phone: phone || 'not-provided',
        timestamp: serverTimestamp(),
        status: 'pending'
      });

      setSubmitted(true);
      // Reset form
      setTimeout(() => {
        setEmail('');
        setName('');
        setPhone('');
        setSubmitted(false);
        onClose();
      }, 3000);
    } catch (err) {
      setError('Failed to save your interest. Please try again.');
      console.error('Error saving registration interest:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {submitted ? (
          // Success Message
          <div className="p-8 text-center">
            <div className="mb-4 text-5xl">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h2>
            <p className="text-gray-600 mb-2">
              Your interest has been recorded for <span className="font-bold">{program}</span>
            </p>
            <p className="text-gray-600 mb-4">
              We'll reach out to you once registration opens!
            </p>
            <p className="text-sm text-gray-500">
              Closing this in a moment...
            </p>
          </div>
        ) : (
          // Registration Form
          <>
            <div className="bg-gradient-to-r from-[#FFD100] to-[#FFC300] p-6">
              <h2 className="text-2xl font-bold text-gray-900">Register Your Interest</h2>
              <p className="text-gray-700 text-sm mt-1">{program}</p>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-l-4 border-[#FFD100]">
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-0.5">🔔</div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Registrations Coming Soon!</p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Registrations are currently closed. Leave your details and we'll reach out to you as soon as registrations open!
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
                    placeholder="0432 XXX XXX"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FFD100] to-[#FFC300] text-gray-900 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Register Interest'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
