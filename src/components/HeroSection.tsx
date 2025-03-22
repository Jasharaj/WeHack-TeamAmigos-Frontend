import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="pt-36 pb-24 bg-gradient-to-b from-white to-green-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
              Justice. <span className="text-green-600 relative">
                Faster.
                <span className="absolute bottom-0 left-0 w-full h-1 bg-green-600 transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></span>
              </span> Smarter.
            </h1>
            <p className="text-lg text-black mb-10 max-w-lg leading-relaxed">
              A modern solution to delays in the justice system. Track cases, get AI assistance, 
              and resolve disputes online with our user-friendly LegalTech platform.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/register" className="btn-primary text-center transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg">
                Get Started
              </Link>
              <Link href="#features" className="btn-secondary text-center transition-all duration-300 transform hover:translate-y-[-2px]">
                Explore Features
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative animate-slideInRight">
            <div className="relative h-[450px] w-full overflow-hidden rounded-2xl shadow-2xl">
              <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Background decorative elements */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-600/10 to-transparent z-10 rounded-2xl"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-50 rounded-full -ml-10 -mb-10"></div>
                  
                  {/* Main image */}
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <Image
                        src="/legal-hero.svg"
                        alt="Digital Justice Platform"
                        fill
                        style={{ objectFit: 'contain' }}
                        className="rounded-xl"
                        priority
                      />
                      
                      {/* Overlay elements */}
                      <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-green-700 mb-1">Modern Justice Platform</h3>
                        <p className="text-sm text-black">Streamlining legal processes with technology</p>
                      </div>
                      
                      {/* Floating elements */}
                      <div className="absolute top-5 right-5 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xl">⚖️</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
