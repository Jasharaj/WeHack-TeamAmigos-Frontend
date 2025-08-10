'use client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSolutionSection from '@/components/ProblemSolutionSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FeaturesSection from '@/components/FeaturesSection';
import WhoItsForSection from '@/components/WhoItsForSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import CursorBlobs from '@/components/CursorBlobs';

export default function Home() {
  return (
    <>
      <CursorBlobs />
      <motion.main 
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ProblemSolutionSection />
        <HowItWorksSection />
        <FeaturesSection />
        <WhoItsForSection />
        <FAQSection />
        <Footer />
        </div>
      </motion.main>
    </>
  );
}
