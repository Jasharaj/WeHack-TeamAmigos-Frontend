'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Play, Star, Users, Award } from 'lucide-react';
import AnimatedGrid from './AnimatedGrid';

const HeroSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Grid Pattern */}
        <AnimatedGrid />
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-20 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-100/60 to-green-200/40 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-teal-100/50 to-emerald-200/30 blur-3xl"
          animate={{
            scale: [1, 0.9, 1],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10">
        <motion.div
          ref={ref}
          className="container-custom px-6 py-20 lg:py-32"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-6 mb-12 text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span>4.9/5 Rating</span>
            </div>
            <div className="w-px h-4 bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>50K+ Active Users</span>
            </div>
            <div className="w-px h-4 bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-2 text-sm font-medium">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Award Winning Platform</span>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="text-center max-w-6xl mx-auto">
            
            {/* Main Headline */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-none mb-4">
                <motion.span 
                  className="inline-block text-slate-900 mr-6"
                  initial={{ x: -100, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 100 }}
                >
                  Justice.
                </motion.span>
                <motion.span 
                  className="inline-block text-emerald-500 mr-6"
                  initial={{ y: -100, opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
                  transition={{ delay: 0.7, duration: 0.8, type: "spring", stiffness: 100 }}
                >
                  Faster.
                </motion.span>
                <motion.span 
                  className="inline-block text-slate-900"
                  initial={{ x: 100, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                  transition={{ delay: 0.9, duration: 0.8, type: "spring", stiffness: 100 }}
                >
                  Smarter.
                </motion.span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
                A modern solution to delays in the justice system. Track cases, 
                get AI assistance, and resolve disputes online with our user-friendly LegalTech platform.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            >
              <Link href="/register">
                <motion.button
                  className="group px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center min-w-[200px] justify-center"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>
              </Link>

              <motion.button
                className="group px-10 py-5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-lg rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 flex items-center min-w-[200px] justify-center"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="mr-3 w-5 h-5 text-emerald-500" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              {[
                { number: "50K+", label: "Cases Resolved", color: "text-emerald-500" },
                { number: "95%", label: "Success Rate", color: "text-green-500" },
                { number: "24/7", label: "AI Support", color: "text-teal-500" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                  transition={{ 
                    delay: 1.7 + index * 0.1, 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`text-5xl md:text-6xl font-black mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-semibold text-lg uppercase tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
