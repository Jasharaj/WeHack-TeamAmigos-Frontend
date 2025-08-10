'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { UserPlus, FileText, Bot, BarChart3, ArrowRight, Sparkles } from 'lucide-react';

const HowItWorksSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your secure account as a citizen or legal professional in under 2 minutes with bank-level security.',
      icon: UserPlus,
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    {
      number: '02',
      title: 'Submit Case',
      description: 'Enter your case details or start dispute resolution with our intelligent guided process.',
      icon: FileText,
      gradient: 'from-emerald-500 to-teal-500',
      delay: 0.2
    },
    {
      number: '03',
      title: 'AI Assistance',
      description: 'Get instant, accurate legal guidance from our advanced AI trained on thousands of legal precedents.',
      icon: Bot,
      gradient: 'from-purple-500 to-pink-500',
      delay: 0.3
    },
    {
      number: '04',
      title: 'Track Progress',
      description: 'Monitor every aspect of your case with real-time updates, smart notifications, and predictive insights.',
      icon: BarChart3,
      gradient: 'from-orange-500 to-red-500',
      delay: 0.4
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden" id="how-it-works">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
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
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 rounded-full text-sm font-medium text-emerald-800 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            HOW IT WORKS
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
            Get Started in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">4 Simple Steps</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our platform makes legal processes intuitive and accessible. 
            Join thousands who've simplified their legal journey with us.
          </p>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-8 rounded-full"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            
            return (
              <motion.div
                key={index}
                className="relative group"
                variants={itemVariants}
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-slate-300 to-transparent z-0"
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                  />
                )}

                <motion.div
                  className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200/50 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 h-full"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step Number */}
                  <motion.div
                    className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                  >
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </motion.div>

                  {/* Icon */}
                  <div className="mb-6 relative">
                    <motion.div
                      className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                    </motion.div>
                    
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
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Action indicator */}
                    <motion.div
                      className="inline-flex items-center text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-sm">Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.div>
                  </div>

                  {/* Progress indicator */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.button
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey Today
            <motion.div
              className="ml-3"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowItWorksSection;
