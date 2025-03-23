import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'AI-Powered Legal Assistant',
      description: 'Get instant answers to legal queries and document analysis with our advanced AI.',
      icon: '🤖'
    },
    {
      title: 'Case Tracking & Updates',
      description: 'Stay updated with real-time case status and important hearing dates.',
      icon: '⚖️'
    },
    {
      title: 'Document Management',
      description: 'Securely store, organize, and share legal documents in one place.',
      icon: '📄'
    },
    {
      title: 'Online Dispute Resolution',
      description: 'Resolve disputes efficiently through our online mediation platform.',
      icon: '🤝'
    },
    {
      title: 'Automated Reminders',
      description: 'Never miss a hearing or deadline with smart notifications.',
      icon: '⏰'
    },
    {
      title: 'Available on Web & Mobile',
      description: 'Access your legal matters anytime, anywhere on any device.',
      icon: '📱'
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-white to-green-50" id="features">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-green-600 font-semibold mb-2 inline-block">POWERFUL FEATURES</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Streamline Your Legal Journey</h2>
          <p className="text-black/80 max-w-2xl mx-auto text-lg">
            Our platform offers powerful tools to make legal processes simpler and more efficient
          </p>
          <div className="w-20 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl border border-black/5 hover:border-green-200 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black group-hover:text-green-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-black/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
