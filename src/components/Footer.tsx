'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Mail, MapPin, Phone, ArrowRight, Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const linkVariants = {
    idle: { x: 0 },
    hover: { x: 5, transition: { duration: 0.2 } }
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
      
      <div className="container-custom relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            className="col-span-1 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-300">
                  <Scale className="w-6 h-6 text-white" />
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
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  CasePilot
                </span>
                <div className="text-sm text-slate-400 -mt-1">Legal Tech Platform</div>
              </div>
            </Link>
            
            <p className="text-slate-300 mb-6 max-w-md leading-relaxed">
              Revolutionizing the legal industry with AI-powered solutions, intelligent case management, 
              and seamless digital experiences for modern legal professionals.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <motion.div
                className="flex items-center space-x-3 text-sm text-slate-400"
                variants={linkVariants}
                initial="idle"
                whileHover="hover"
              >
                <Mail className="w-4 h-4 text-green-400" />
                <span>hello@casepilot.in</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-3 text-sm text-slate-400"
                variants={linkVariants}
                initial="idle"
                whileHover="hover"
              >
                <Phone className="w-4 h-4 text-green-400" />
                <span>+91 98765 43210</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-3 text-sm text-slate-400"
                variants={linkVariants}
                initial="idle"
                whileHover="hover"
              >
                <MapPin className="w-4 h-4 text-green-400" />
                <span>Mumbai, Maharashtra, India</span>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-green-400 hover:bg-slate-700 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-white mb-6 relative">
              Company
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" />
            </h3>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Press', 'Blog', 'Partners'].map((item, index) => (
                <motion.li key={item}>
                  <motion.div
                    variants={linkVariants}
                    initial="idle"
                    whileHover="hover"
                  >
                    <Link 
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="flex items-center text-slate-300 hover:text-green-400 transition-colors duration-200 group"
                    >
                      <span>{item}</span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-white mb-6 relative">
              Legal & Support
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" />
            </h3>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Help Center', 'Security'].map((item, index) => (
                <motion.li key={item}>
                  <motion.div
                    variants={linkVariants}
                    initial="idle"
                    whileHover="hover"
                  >
                    <Link 
                      href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                      className="flex items-center text-slate-300 hover:text-green-400 transition-colors duration-200 group"
                    >
                      <span>{item}</span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 mt-12 border-t border-slate-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8 text-sm text-slate-400">
              <span>© {currentYear} CasePilot. All rights reserved.</span>
              <span>Made with ❤️ for better justice</span>
            </div>
            
            <motion.div
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-full border border-green-700/30"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">All systems operational</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
