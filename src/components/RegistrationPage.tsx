'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import config from '../config';

const RegistrationPage: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<'citizen' | 'lawyer'>('citizen');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'terms') {
        setTermsAccepted(checked);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!termsAccepted) {
        throw new Error('You must accept the Terms of Service and Privacy Policy');
      }

      // Prepare data for submission
      const registrationData = {
        ...formData,
        role
      };

      // Send registration request
      const response = await fetch(`${config.BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Show success and redirect to login page
      alert(data.message || 'Registration successful! Please login.');
      router.push('/login');
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
                Join the Future
              </h2>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-12 w-1 bg-green-400 rounded-full"></div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-600">
                of Legal Tech
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-lg text-black leading-relaxed">
              CasePilot revolutionizes legal services with cutting-edge technology. Join us to:
            </p>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg">&#10003;</span>
                </div>
                <span className="text-black">Access AI-powered legal insights</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg">&#10003;</span>
                </div>
                <span className="text-black">Connect with legal professionals</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg">&#10003;</span>
                </div>
                <span className="text-black">Streamline your legal processes</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <p className="text-black">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                Sign in here &#8594;
              </Link>
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="max-w-md md:ml-auto w-full bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-black lg:text-3xl text-2xl font-bold mb-8">Create Account</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`p-4 rounded-lg border ${
                  role === 'citizen'
                    ? 'border-green-600 bg-green-50 text-green-600'
                    : 'border-green-100 hover:border-green-200'
                } transition-all duration-200`}
              >
                <span className="block text-2xl mb-2">&#128100;</span>
                <span className="font-medium">Citizen</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('lawyer')}
                className={`p-4 rounded-lg border ${
                  role === 'lawyer'
                    ? 'border-green-600 bg-green-50 text-green-600'
                    : 'border-green-100 hover:border-green-200'
                } transition-all duration-200`}
              >
                <span className="block text-2xl mb-2">&#128269;&#65039;</span>
                <span className="font-medium">Lawyer</span>
              </button>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="text-sm text-black font-medium mb-2 block">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="bg-green-50 w-full text-sm text-black px-4 py-3 rounded-md outline-none border border-green-100 focus:border-green-600 focus:bg-white transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm text-black font-medium mb-2 block">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-green-50 w-full text-sm text-black px-4 py-3 rounded-md outline-none border border-green-100 focus:border-green-600 focus:bg-white transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="text-sm text-black font-medium mb-2 block">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-green-50 w-full text-sm text-black px-4 py-3 rounded-md outline-none border border-green-100 focus:border-green-600 focus:bg-white transition-all duration-200"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm text-black font-medium mb-2 block">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="bg-green-50 w-full text-sm text-black px-4 py-3 rounded-md outline-none border border-green-100 focus:border-green-600 focus:bg-white transition-all duration-200"
                placeholder="Create a strong password"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={handleChange}
                className="h-4 w-4 mt-1 text-green-600 focus:ring-green-500 border-green-300 rounded"
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-black">
                I agree to the{' '}
                <Link href="/terms" className="text-green-600 hover:text-green-700 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-green-600 hover:text-green-700 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full shadow-xl py-3 px-4 text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-all duration-200 transform hover:translate-y-[-2px] disabled:bg-green-400 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
