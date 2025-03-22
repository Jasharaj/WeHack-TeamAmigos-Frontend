import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSolutionSection from '@/components/ProblemSolutionSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FeaturesSection from '@/components/FeaturesSection';
import WhoItsForSection from '@/components/WhoItsForSection';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <WhoItsForSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
