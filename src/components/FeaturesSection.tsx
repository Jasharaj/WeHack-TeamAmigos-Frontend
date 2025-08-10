'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Bot, Scale, FileText, Handshake, Clock, Smartphone, Sparkles, ArrowRight } from 'lucide-react';

const FeaturesSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const features = [
    {
      title: 'AI-Powered Legal Assistant',
      description: 'Get instant answers to legal queries and document analysis with our advanced AI technology.',
      icon: Bot,
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    {
      title: 'Real-time Case Tracking',
      description: 'Stay updated with live case status, hearing dates, and important notifications.',
      icon: Scale,
      gradient: 'from-green-500 to-emerald-500',
      delay: 0.2
    },
    {
      title: 'Smart Document Management',
      description: 'Securely store, organize, and share legal documents with AI-powered organization.',
      icon: FileText,
      gradient: 'from-purple-500 to-pink-500',
      delay: 0.3
    },
    {
      title: 'Online Dispute Resolution',
      description: 'Resolve disputes efficiently through our cutting-edge online mediation platform.',
      icon: Handshake,
      gradient: 'from-orange-500 to-red-500',
      delay: 0.4
    },
    {
      title: 'Intelligent Reminders',
      description: 'Never miss a deadline with AI-powered smart notifications and calendar integration.',
      icon: Clock,
      gradient: 'from-indigo-500 to-purple-500',
      delay: 0.5
    },
    {
      title: 'Cross-platform Access',
      description: 'Access your legal matters seamlessly across web, mobile, and tablet devices.',
      icon: Smartphone,
      gradient: 'from-pink-500 to-rose-500',
      delay: 0.6
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-green-50 relative overflow-hidden" id="features">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        ref={ref}
        className="container-custom relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Header */}
        <motion.div className="text-center mb-20" variants={itemVariants}>
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-full text-sm font-medium text-green-800 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            POWERFUL FEATURES
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="text-slate-900">Streamline Your</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Legal Journey
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Transform your legal experience with cutting-edge AI technology, intelligent automation, 
            and seamless digital solutions designed for modern legal practice.
          </motion.p>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-8 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={index}
                className="group relative"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/50 hover:border-green-200 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden">
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Floating sparkle */}
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0, rotate: 0 }}
                      whileHover={{ 
                        scale: 1, 
                        rotate: 360,
                        transition: { duration: 0.5 }
                      }}
                    >
                      <Sparkles className="w-3 h-3 text-yellow-800" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <motion.h3 
                      className="text-xl font-bold mb-4 text-slate-900 group-hover:text-green-600 transition-colors duration-300"
                      layoutId={`title-${index}`}
                    >
                      {feature.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-slate-600 leading-relaxed mb-6"
                      layoutId={`description-${index}`}
                    >
                      {feature.description}
                    </motion.p>

                    {/* Learn more link */}
                    <motion.div
                      className="flex items-center text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-sm">Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.div>
                  </div>

                  {/* Hover effect line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          variants={itemVariants}
        >
          <motion.button
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Features
            <ArrowRight className="ml-2 w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
