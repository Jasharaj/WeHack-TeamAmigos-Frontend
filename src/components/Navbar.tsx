'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, Scale, Sparkles, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const user = localStorage.getItem('user');
      
      if (token && role) {
        setIsAuthenticated(true);
        setUserRole(role);
        
        if (user) {
          try {
            const userData = JSON.parse(user);
            setUserName(userData.name || 'User');
          } catch (e) {
            setUserName('User');
          }
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserName('');
      }
    };

    checkAuth();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('');
    router.push('/');
  };

  const handleDashboardRedirect = () => {
    if (userRole === 'lawyer') {
      router.push('/lawyer-dashboard');
    } else if (userRole === 'citizen') {
      router.push('/user-dashboard');
    }
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const linkVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/20 py-2' 
          : 'bg-transparent py-4'
      }`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-300">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-2 h-2 text-yellow-800" />
                </motion.div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  CasePilot
                </span>
                <div className="text-xs text-slate-500 -mt-1">Legal Tech</div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Features', href: '#features' },
              { name: 'How It Works', href: '#how-it-works' },
              { name: 'Who Its For', href: '#who-its-for' },
              { name: 'FAQ', href: '#faq' }
            ].map((item, index) => (
              <motion.div
                key={item.name}
                variants={linkVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
              >
                <Link 
                  href={item.href}
                  className="relative text-slate-700 hover:text-green-600 font-medium transition-colors duration-200 group"
                >
                  {item.name}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              // Authenticated user UI
              <>
                <motion.div
                  variants={linkVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <button
                    onClick={handleDashboardRedirect}
                    className="flex items-center gap-2 text-slate-700 hover:text-green-600 font-medium px-4 py-2 rounded-xl hover:bg-green-50 transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    {userName}
                  </button>
                </motion.div>
                <motion.div
                  variants={linkVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              </>
            ) : (
              // Unauthenticated user UI
              <>
                <motion.div
                  variants={linkVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link 
                    href="/login" 
                    className="text-slate-700 hover:text-green-600 font-medium px-4 py-2 rounded-xl hover:bg-green-50 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  variants={linkVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link 
                    href="/register" 
                    className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-slate-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden overflow-hidden bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/20 mt-4 ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 0, 
            opacity: isMobileMenuOpen ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 space-y-4">
            {['Features', 'How It Works', 'Pricing', 'About'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-slate-700 hover:text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-green-50 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
            <div className="border-t border-slate-200 pt-4 space-y-2">
              {isAuthenticated ? (
                // Authenticated mobile menu
                <>
                  <button 
                    onClick={handleDashboardRedirect}
                    className="block w-full text-left text-slate-700 hover:text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-green-50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Dashboard ({userName})
                    </div>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="block w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </div>
                  </button>
                </>
              ) : (
                // Unauthenticated mobile menu
                <>
                  <Link 
                    href="/login" 
                    className="block text-slate-700 hover:text-green-600 font-medium py-2 px-4 rounded-lg hover:bg-green-50 transition-colors duration-200 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    className="block px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
