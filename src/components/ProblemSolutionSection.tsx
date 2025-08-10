'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X, Check, AlertTriangle, Target, Zap, Shield } from 'lucide-react';

const ProblemSolutionSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const problemItems = [
    {
      icon: AlertTriangle,
      text: "Overwhelming case backlogs causing years of delays",
      color: "text-red-500"
    },
    {
      icon: AlertTriangle,
      text: "Lack of transparency in case status and progress",
      color: "text-red-500"
    },
    {
      icon: AlertTriangle,
      text: "Difficult access to legal information for citizens",
      color: "text-red-500"
    },
    {
      icon: AlertTriangle,
      text: "Inefficient communication between lawyers and clients",
      color: "text-red-500"
    }
  ];

  const solutionItems = [
    {
      icon: Zap,
      text: "AI-powered legal assistant for instant guidance and information",
      color: "text-emerald-500"
    },
    {
      icon: Target,
      text: "Transparent case tracking with real-time updates",
      color: "text-emerald-500"
    },
    {
      icon: Shield,
      text: "Online Dispute Resolution to settle matters without court",
      color: "text-emerald-500"
    },
    {
      icon: Check,
      text: "Automated reminders for hearings and important deadlines",
      color: "text-emerald-500"
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
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const solutionVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden" id="problem-solution">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl" />
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
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-50 to-emerald-50 border border-red-100 rounded-full text-sm font-medium text-slate-700 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
            THE CHALLENGE WE'RE SOLVING
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-slate-900 leading-tight">
            Breaking the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500">Cycle of Delay</span> in Indian Justice System
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Every delayed case is a denied opportunity for justice. We're transforming how legal processes work in India with cutting-edge technology.
          </p>
          
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-emerald-500 mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          />
        </motion.div>

        {/* Problem vs Solution Cards */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Problems Card */}
          <motion.div
            className="relative bg-gradient-to-br from-red-50 via-white to-orange-50 rounded-3xl p-8 border border-red-100 shadow-lg"
            variants={containerVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Problem Header */}
            <div className="text-center mb-10">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl mb-6 shadow-xl"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <X className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                Current <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Problems</span>
              </h3>
              <p className="text-lg text-slate-600 font-medium">What's broken in today's justice system</p>
            </div>

            {/* Problems List */}
            <div className="space-y-5">
              {problemItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden"
                  variants={itemVariants}
                  initial={{ opacity: 0, x: -50 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-start space-x-4 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-red-100 group-hover:border-red-200 group-hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center group-hover:from-red-200 group-hover:to-orange-200 transition-all duration-300">
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 font-semibold leading-relaxed group-hover:text-slate-900 transition-colors duration-300">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Problem Stats */}
            <motion.div 
              className="mt-8 pt-6 border-t border-red-100"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-black text-red-600">4.5 Crore+</div>
                  <div className="text-sm text-slate-600 font-medium">Pending Cases</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-orange-600">15+ Years</div>
                  <div className="text-sm text-slate-600 font-medium">Average Delay</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Solutions Card */}
          <motion.div
            className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl p-8 border border-emerald-200 shadow-lg"
            variants={containerVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Solution Header */}
            <div className="text-center mb-10">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl mb-6 shadow-xl"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Solutions</span>
              </h3>
              <p className="text-lg text-slate-600 font-medium">How CasePilot transforms justice</p>
            </div>

            {/* Solutions List */}
            <div className="space-y-5">
              {solutionItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden"
                  variants={solutionVariants}
                  initial={{ opacity: 0, x: 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-start space-x-4 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 group-hover:border-emerald-200 group-hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-300">
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 font-semibold leading-relaxed group-hover:text-slate-900 transition-colors duration-300">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Solution Stats */}
            <motion.div 
              className="mt-8 pt-6 border-t border-emerald-100"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.4 }}
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-black text-emerald-600">90%</div>
                  <div className="text-sm text-slate-600 font-medium">Faster Resolution</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-teal-600">24/7</div>
                  <div className="text-sm text-slate-600 font-medium">AI Assistance</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
};

export default ProblemSolutionSection;
