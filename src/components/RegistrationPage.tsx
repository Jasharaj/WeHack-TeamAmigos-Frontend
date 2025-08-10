'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Bot, 
  Sun, 
  Moon,
  Scale,
  Shield,
  Lock,
  Zap,
  Users,
  Award,
  Globe,
  UserPlus,
  Mail,
  Phone
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
          required
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

// Input Field Component
const InputField: React.FC<{
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ComponentType<any>;
  required?: boolean;
}> = ({ type, value, onChange, placeholder = "", label = "", icon: Icon, required = false }) => {
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
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
          required={required}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
        />
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
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
        { id: 'citizen', label: 'Citizen', icon: Users, desc: 'Legal guidance' },
        { id: 'lawyer', label: 'Lawyer', icon: Scale, desc: 'Professional' }
      ].map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          onClick={() => onTabChange(tab.id as 'citizen' | 'lawyer')}
          className="relative flex-1 flex flex-col items-center justify-center space-y-1 py-4 px-4 rounded-lg text-sm font-medium transition-all duration-300"
        >
          {activeTab === tab.id && (
            <motion.div
              className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm rounded-lg border border-emerald-500/30"
              layoutId="activeTab"
              transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
            />
          )}
          <tab.icon className="w-5 h-5" />
          <span className={activeTab === tab.id ? 'text-emerald-400' : 'text-slate-300'}>
            {tab.label}
          </span>
          <span className={`text-xs ${activeTab === tab.id ? 'text-emerald-300' : 'text-slate-400'}`}>
            {tab.desc}
          </span>
        </button>
      ))}
    </div>
  );
};

// Main Registration Page Component
const RegistrationPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'citizen' | 'lawyer'>('citizen');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [agreed, setAgreed] = useState(false);
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
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Validate lawyer-specific fields
      if (activeTab === 'lawyer') {
        if (!licenseNumber.trim()) {
          throw new Error('License number is required for lawyers');
        }
        if (!specialization) {
          throw new Error('Specialization is required for lawyers');
        }
        if (!yearsOfExperience.trim()) {
          throw new Error('Years of experience is required for lawyers');
        }
        if (parseInt(yearsOfExperience) < 0) {
          throw new Error('Years of experience cannot be negative');
        }
      }

      if (!agreed) {
        throw new Error('Please accept the terms and conditions');
      }

      const registrationData = {
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        password,
        role: activeTab,
        ...(activeTab === 'lawyer' && {
          licenseNumber,
          specialization,
          yearsOfExperience: parseInt(yearsOfExperience) || 0
        })
      };

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

      // Store the token and user data if registration includes auto-login
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role); // Store role separately for dashboard auth check
      }

      setShowToast(true);
      setTimeout(() => {
        if (data.token && data.user) {
          // Direct redirect to dashboard based on role
          if (data.user.role === 'lawyer') {
            router.push('/lawyer-dashboard');
          } else {
            router.push('/user-dashboard');
          }
        } else {
          // Fallback to login page if no auto-login
          router.push('/login');
        }
      }, 1000);

    } catch (err: any) {
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
          
          {/* Left Column - Registration Card */}
          <motion.div
            className="flex justify-center lg:justify-start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" as const, stiffness: 100 }}
          >
            <div className="w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Create {activeTab === 'lawyer' ? 'lawyer' : 'citizen'} account
                  </h2>
                  <p className="text-slate-300">
                    {activeTab === 'lawyer' 
                      ? 'Join thousands of legal professionals' 
                      : 'Join thousands of users seeking legal help'
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      type="text"
                      value={firstName}
                      onChange={setFirstName}
                      label="First name"
                      placeholder="John"
                      icon={UserPlus}
                      required
                    />
                    <InputField
                      type="text"
                      value={lastName}
                      onChange={setLastName}
                      label="Last name"
                      placeholder="Doe"
                      required
                    />
                  </div>

                  <InputField
                    type="email"
                    value={email}
                    onChange={setEmail}
                    label="Email address"
                    placeholder="john@example.com"
                    icon={Mail}
                    required
                  />

                  <InputField
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    label="Phone number"
                    placeholder="+91 9876543210"
                    icon={Phone}
                    required
                  />

                  {/* Lawyer-specific fields */}
                  <AnimatePresence>
                    {activeTab === 'lawyer' && (
                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <InputField
                          type="text"
                          value={licenseNumber}
                          onChange={setLicenseNumber}
                          label="Bar License Number"
                          placeholder="Enter your bar license number"
                          icon={Award}
                          required={activeTab === 'lawyer'}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">
                              Specialization
                            </label>
                            <select
                              value={specialization}
                              onChange={(e) => setSpecialization(e.target.value)}
                              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                              required={activeTab === 'lawyer'}
                            >
                              <option value="" className="bg-slate-800">Select specialization</option>
                              <option value="corporate" className="bg-slate-800">Corporate Law</option>
                              <option value="criminal" className="bg-slate-800">Criminal Law</option>
                              <option value="family" className="bg-slate-800">Family Law</option>
                              <option value="intellectual" className="bg-slate-800">Intellectual Property</option>
                              <option value="real-estate" className="bg-slate-800">Real Estate Law</option>
                              <option value="employment" className="bg-slate-800">Employment Law</option>
                              <option value="tax" className="bg-slate-800">Tax Law</option>
                              <option value="other" className="bg-slate-800">Other</option>
                            </select>
                          </div>
                          <InputField
                            type="number"
                            value={yearsOfExperience}
                            onChange={setYearsOfExperience}
                            label="Years of Experience"
                            placeholder="5"
                            required={activeTab === 'lawyer'}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <PasswordField
                      value={password}
                      onChange={setPassword}
                      label="Password"
                      placeholder="Create password"
                    />
                    <PasswordField
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      label="Confirm"
                      placeholder="Confirm password"
                    />
                  </div>

                  <div className="flex items-start space-x-3 py-4">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 text-emerald-500 bg-transparent border-2 border-white/30 rounded focus:ring-emerald-500/50 focus:ring-2 mt-0.5"
                    />
                    <label htmlFor="terms" className="text-slate-300 text-sm leading-relaxed">
                      I agree to the{' '}
                      <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">
                        Privacy Policy
                      </Link>
                    </label>
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
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      `Create ${activeTab === 'lawyer' ? 'Lawyer' : 'Citizen'} Account`
                    )}
                  </motion.button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-slate-300 text-sm">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
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
                    Build your{' '}
                    <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                      legal practice
                    </span>
                  </>
                ) : (
                  <>
                    Join the future of{' '}
                    <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                      legal technology
                    </span>
                  </>
                )}
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                {activeTab === 'lawyer' 
                  ? "Advanced practice management tools for legal professionals. Grow your client base and streamline your workflow with AI-powered insights."
                  : "Connect with legal experts, manage cases efficiently, and access AI-powered legal insights. Start your journey today."
                }
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div variants={itemVariants} className="space-y-4">
              {(activeTab === 'lawyer' ? [
                { icon: Users, text: "Client management system" },
                { icon: Zap, text: "AI case analysis" },
                { icon: Award, text: "Professional certification" },
                { icon: Shield, text: "Secure client data" }
              ] : [
                { icon: Zap, text: "AI-powered legal research" },
                { icon: Users, text: "Expert legal network" },
                { icon: Shield, text: "Secure & confidential" },
                { icon: Award, text: "Proven success rate" }
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

            {/* Social Proof */}
            <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-white font-bold text-sm ${i === 1 ? 'bg-emerald-600' : i === 2 ? 'bg-blue-600' : i === 3 ? 'bg-purple-600' : 'bg-orange-600'}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-white font-semibold">50,000+ professionals</div>
                  <div className="text-slate-400 text-sm">already using CasePilot</div>
                </div>
              </div>
            </motion.div>
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
              <span className="font-medium">Account created successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistrationPage;
