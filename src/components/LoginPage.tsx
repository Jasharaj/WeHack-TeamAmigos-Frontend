'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sun, 
  Moon,
  Scale,
  Shield,
  Lock,
  Zap,
  Users,
  FileText,
  Award,
  Globe
} from 'lucide-react';
import config from '../config';
import Navbar from './Navbar';

// Animated Background Component
const AnimatedBackground: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/20" />
      
      {/* Animated Gradient Blobs */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          animate={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
    </div>
  );
};

// Password Field Component
const PasswordField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}> = ({ value, onChange, placeholder = "Enter password", label = "Password" }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <motion.label
        className="block text-sm font-medium text-slate-300"
        animate={{ scale: value ? 0.9 : 1 }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
      >
        {label}
      </motion.label>
      <div className="relative">
        <motion.input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors duration-200"
        >
          <motion.div
            initial={false}
            animate={{ rotate: showPassword ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </motion.div>
        </button>
      </div>
    </div>
  );
};

// Auth Tabs Component
const AuthTabs: React.FC<{
  activeTab: 'citizen' | 'lawyer';
  onTabChange: (tab: 'citizen' | 'lawyer') => void;
}> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-6" role="tablist">
      {[
        { id: 'citizen', label: 'Citizen', icon: Users },
        { id: 'lawyer', label: 'Lawyer', icon: Scale }
      ].map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          onClick={() => onTabChange(tab.id as 'citizen' | 'lawyer')}
          className="relative flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300"
        >
          {activeTab === tab.id && (
            <motion.div
              className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm rounded-lg border border-emerald-500/30"
              layoutId="activeTab"
              transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
            />
          )}
          <tab.icon className="w-4 h-4" />
          <span className={activeTab === tab.id ? 'text-emerald-400' : 'text-slate-300'}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <Moon className="w-5 h-5 text-slate-300" /> : <Sun className="w-5 h-5 text-yellow-400" />}
      </motion.div>
    </button>
  );
};

// Main Login Page Component
const LoginPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'citizen' | 'lawyer'>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Check if user is already logged in and redirect them
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      // User is already logged in, redirect to their dashboard
      if (role === 'lawyer') {
        router.push('/lawyer-dashboard');
      } else if (role === 'citizen') {
        router.push('/user-dashboard');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate lawyer-specific fields
      if (activeTab === 'lawyer' && !licenseNumber.trim()) {
        throw new Error('License number is required for lawyers');
      }
      
      const response = await fetch(`${config.BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: activeTab,
          ...(activeTab === 'lawyer' && licenseNumber && { licenseNumber })
        }),
      });

      // Check if the response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If not JSON, handle the error
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
      }
      
      console.log('Login response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Handle different response structures
      const userData = data.user || data.data || data;
      const userRole = userData?.role || data.role;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userRole); // Store role separately for dashboard auth check
      console.log('Full response data:', data); // Debug log
      console.log('Response keys:', Object.keys(data)); // Debug log
      console.log('User data stored:', userData); // Debug log
      console.log('User role:', userRole); // Debug log
      
      // Check if data has different structure
      if (data.data) {
        console.log('Found data.data:', data.data);
      }
      if (data.userData) {
        console.log('Found data.userData:', data.userData);
      }

      setShowToast(true);
      
      // Try immediate redirect without timeout first
      console.log('About to redirect with role:', userRole);
      
      if (userData && userRole === 'lawyer') {
        console.log('Redirecting to lawyer dashboard');
        try {
          await router.push('/lawyer-dashboard');
          console.log('Router push completed');
        } catch (routerError) {
          console.error('Router push failed, trying window.location:', routerError);
          window.location.href = '/lawyer-dashboard';
        }
      } else if (userData && userRole === 'citizen') {
        console.log('Redirecting to user dashboard');
        try {
          await router.push('/user-dashboard');
          console.log('Router push completed');
        } catch (routerError) {
          console.error('Router push failed, trying window.location:', routerError);
          window.location.href = '/user-dashboard';
        }
      } else {
        console.log('No valid role found, staying on login page');
        console.log('Available data:', data);
      }

    } catch (err: any) {
      console.error('Login error:', err); // Debug log
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 pt-32">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                {activeTab === 'lawyer' ? (
                  <>
                    Professional legal{' '}
                    <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                      practice management
                    </span>
                  </>
                ) : (
                  <>
                    Your legal journey,{' '}
                    <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                      beautifully streamlined
                    </span>
                  </>
                )}
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                {activeTab === 'lawyer' 
                  ? "Advanced tools for legal professionals. Manage clients, cases, and grow your practice with AI-powered insights."
                  : "Experience the future of legal technology with AI-powered insights, seamless case management, and instant expert connections."
                }
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div variants={itemVariants} className="space-y-4">
              {(activeTab === 'lawyer' ? [
                { icon: Scale, text: "Client case management" },
                { icon: Users, text: "Professional network" },
                { icon: FileText, text: "Document automation" }
              ] : [
                { icon: Zap, text: "Track cases in real time" },
                { icon: Scale, text: "AI legal assistance" },
                { icon: Shield, text: "Secure document management" }
              ]).map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  variants={itemVariants}
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300 text-lg">{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Chips */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              {[
                { icon: Shield, label: "ISO 27001" },
                { icon: Lock, label: "SOC 2" },
                { icon: Globe, label: "GDPR-ready" },
                { icon: Users, label: "24/7 Support" }
              ].map((chip, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                >
                  <chip.icon className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 text-sm font-medium">{chip.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Sign In Card */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" as const, stiffness: 100 }}
          >
            <div className="w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
                  <p className="text-slate-300">
                    {activeTab === 'lawyer' 
                      ? 'Access your legal practice dashboard' 
                      : 'Continue your legal journey'
                    }
                  </p>
                </div>

                <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 text-red-200"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      role="alert"
                      aria-live="polite"
                    >
                      <p className="text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <motion.label
                      className="block text-sm font-medium text-slate-300"
                      animate={{ scale: email ? 0.9 : 1 }}
                      transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
                    >
                      Email address
                    </motion.label>
                    <motion.input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                      required
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
                    />
                  </div>

                  {/* License Number - Only for Lawyers */}
                  <AnimatePresence>
                    {activeTab === 'lawyer' && (
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.label
                          className="block text-sm font-medium text-slate-300"
                          animate={{ scale: licenseNumber ? 0.9 : 1 }}
                          transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
                        >
                          Bar License Number
                        </motion.label>
                        <motion.input
                          type="text"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder="Enter your bar license number"
                          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                          required={activeTab === 'lawyer'}
                          whileFocus={{ scale: 1.02 }}
                          transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <PasswordField
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-emerald-500 bg-transparent border-2 border-white/30 rounded focus:ring-emerald-500/50 focus:ring-2"
                      />
                      <span className="text-slate-300 text-sm">Remember me</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      `Sign in${activeTab === 'lawyer' ? ' as Lawyer' : ''}`
                    )}
                  </motion.button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-slate-300 text-sm">
                    No account?{' '}
                    <Link
                      href="/register"
                      className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                    >
                      Create one now
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed top-6 right-6 z-50 bg-emerald-500/90 backdrop-blur-xl rounded-xl px-6 py-4 text-white shadow-2xl border border-emerald-400/30"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Successfully signed in!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
