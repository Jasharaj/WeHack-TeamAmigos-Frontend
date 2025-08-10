'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Scale, CheckCircle, ArrowRight, Sparkles, Gavel } from 'lucide-react';

const WhoItsForSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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

  const citizenFeatures = [
    'Track your cases with real-time updates and notifications',
    'Get instant answers to common legal questions from AI',
    'Receive smart reminders for hearings and deadlines',
    'Resolve disputes online without going to court',
    'Access legal documents and forms 24/7'
  ];

  const lawyerFeatures = [
    'Manage multiple cases efficiently in one platform',
    'Conduct legal research faster with AI assistance',
    'Communicate seamlessly with clients through secure channels',
    'Automate routine tasks to focus on complex legal work',
    'Generate insights and analytics on case performance'
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden" id="who-its-for">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-grid-slate-100/25 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
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
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 rounded-full text-sm font-medium text-slate-700 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            WHO IT'S FOR
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">Everyone</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            CasePilot serves both citizens seeking justice and legal professionals 
            looking to modernize their practice with cutting-edge technology.
          </p>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 mx-auto mt-8 rounded-full"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* For Citizens */}
          <motion.div
            className="group relative"
            variants={itemVariants}
            whileHover={{ y: -10 }}
          >
            <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 p-10 rounded-3xl border border-blue-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 h-full overflow-hidden">
              
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-grid-blue-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black_100%)] opacity-30" />
              
              {/* Header */}
              <div className="relative text-center mb-8">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Users className="w-12 h-12 text-white" />
                </motion.div>
                
                <h3 className="text-3xl font-bold text-slate-900 mb-3">
                  For <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Citizens</span>
                </h3>
                <p className="text-slate-600">Empowering individuals to navigate the legal system with confidence</p>
              </div>

              {/* Features */}
              <div className="relative space-y-4">
                {citizenFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 group/item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <motion.div
                      className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center group-hover/item:bg-blue-200 transition-colors duration-300 mt-1"
                      whileHover={{ scale: 1.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </motion.div>
                    <p className="text-slate-700 leading-relaxed font-medium">{feature}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div className="mt-8">
                <motion.button
                  className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started as Citizen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </motion.button>
              </motion.div>

              {/* Floating Sparkle */}
              <motion.div
                className="absolute top-6 right-6 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-yellow-800" />
              </motion.div>
            </div>
          </motion.div>

          {/* For Lawyers */}
          <motion.div
            className="group relative"
            variants={itemVariants}
            whileHover={{ y: -10 }}
          >
            <div className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-10 rounded-3xl border border-emerald-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 h-full overflow-hidden">
              
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-grid-emerald-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black_100%)] opacity-30" />
              
              {/* Header */}
              <div className="relative text-center mb-8">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <Scale className="w-12 h-12 text-white" />
                </motion.div>
                
                <h3 className="text-3xl font-bold text-slate-900 mb-3">
                  For <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Lawyers</span>
                </h3>
                <p className="text-slate-600">Advanced tools for modern legal professionals</p>
              </div>

              {/* Features */}
              <div className="relative space-y-4">
                {lawyerFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 group/item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <motion.div
                      className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center group-hover/item:bg-emerald-200 transition-colors duration-300 mt-1"
                      whileHover={{ scale: 1.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </motion.div>
                    <p className="text-slate-700 leading-relaxed font-medium">{feature}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div className="mt-8">
                <motion.button
                  className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join as Legal Professional
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </motion.button>
              </motion.div>

              {/* Floating Gavel */}
              <motion.div
                className="absolute top-6 right-6 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                animate={{ 
                  rotate: [0, -15, 15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Gavel className="w-4 h-4 text-amber-800" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default WhoItsForSection;
