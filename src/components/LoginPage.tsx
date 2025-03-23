'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config from '../config';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<'citizen' | 'lawyer'>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`${config.BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      localStorage.setItem('role', data.role);

      // Redirect based on role
      if (data.role === 'citizen') {
        router.push('/user-dashboard');
      } else if (data.role === 'lawyer') {
        router.push('/lawyer-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 bg-gradient-to-b from-white to-green-50">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full max-md:max-w-md">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="inline-block">
            <div className="flex items-center space-x-2">
              <div className="h-12 w-1 bg-green-600 rounded-full"></div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
                Welcome Back
              </h2>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-12 w-1 bg-green-400 rounded-full"></div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-600">
                to CasePilot
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-lg text-black leading-relaxed">
              Your legal journey continues here. Access your dashboard to:
            </p>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <span className="text-black">Track your cases in real-time</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <span className="text-black">Get instant AI legal assistance</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <span className="text-black">Manage documents securely</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <p className="text-black">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                Create one now →
              </Link>
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="max-w-md md:ml-auto w-full bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-black lg:text-3xl text-2xl font-bold mb-8">Sign in</h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Role Selection */}
            <div className="flex gap-4 p-1 bg-green-50 rounded-lg">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  role === 'citizen'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-black hover:text-green-600'
                }`}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole('lawyer')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  role === 'lawyer'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-black hover:text-green-600'
                }`}
              >
                Lawyer
              </button>
            </div>

            <div>
              <label htmlFor="email" className="text-sm text-black font-medium mb-2 block">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-green-50 w-full text-sm text-black px-4 py-3 rounded-md outline-none border border-green-100 focus:border-green-600 focus:bg-white transition-all duration-200"
                placeholder="Enter Email"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm text-black font-medium mb-2 block">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-green-50 w-full text-sm text-black px-4 py-3 rounded-md outline-none border border-green-100 focus:border-green-600 focus:bg-white transition-all duration-200"
                placeholder="Enter Password"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-black">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
