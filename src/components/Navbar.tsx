'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-green-600">CasePilot</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-black hover:text-green-600 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-black hover:text-green-600 transition-colors">
            How It Works
          </Link>
          <Link href="#about" className="text-black hover:text-green-600 transition-colors">
            About
          </Link>
          <Link href="#faq" className="text-black hover:text-green-600 transition-colors">
            FAQ
          </Link>
        </div>

        {/* Auth CTAs */}
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
