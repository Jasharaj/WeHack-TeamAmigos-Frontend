'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 ${
      isScrolled ? 'py-2' : 'py-4'
    }`}>
      <div className="container-custom h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-green-600">CasePilot</span>
        </Link>

        {/* Navigation Links - Centered */}
        <div className="hidden md:flex items-center justify-center flex-1 space-x-8 px-4">
          <Link href="#features" className="text-black hover:text-green-600 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-black hover:text-green-600 transition-colors">
            How It Works
          </Link>
          <Link href="#faq" className="text-black hover:text-green-600 transition-colors">
            FAQ
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/login" 
            className="text-black hover:text-green-600 transition-colors px-4 py-2 rounded-lg hover:bg-green-50"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="btn-primary transform hover:translate-y-[-2px] transition-transform duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
