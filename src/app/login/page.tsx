// src/app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaSignInAlt, FaUser, FaLock, FaSpinner, FaInfoCircle } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, login, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated AND not currently loading auth state
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setIsSubmitting(false);
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password.');
    }
    setIsSubmitting(false);
  };

  // Show a simple loading state or null if already authenticated and redirecting
  if (isLoading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
        <p className="ml-4 text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <FaSignInAlt className="text-indigo-600 text-5xl mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-800">Sign In</h1>
          <p className="text-gray-500 mt-2">Access your HR Dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><FaUser /></span>
              <input type="email" id="email" className="pl-10 pr-3 py-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><FaLock /></span>
              <input type="password" id="password" className="pl-10 pr-3 py-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-center">
              <FaInfoCircle className="mr-2" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-full shadow-lg
                       text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                       transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <><FaSpinner className="animate-spin mr-3" /> Signing In...</> : <><FaSignInAlt className="mr-2" /> Sign In</>}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-8">Hint: `user@example.com` / `password123`</p>
      </div>
    </div>
  );
}