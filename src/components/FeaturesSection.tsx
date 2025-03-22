const FeaturesSection = () => {
  const features = [
    {
      title: 'AI Legal Assistant',
      description: 'Get instant answers to common legal questions and guidance on procedures.',
      icon: '🧠'
    },
    {
      title: 'Case Tracking',
      description: 'Monitor your case progress with real-time updates and a transparent timeline.',
      icon: '📋'
    },
    {
      title: 'Online Dispute Resolution',
      description: 'Resolve disputes efficiently without the need for lengthy court proceedings.',
      icon: '⚖️'
    },
    {
      title: 'Hearing Notifications',
      description: 'Never miss a deadline with automated reminders for important dates.',
      icon: '🔔'
    },
    {
      title: 'Lawyer-Citizen Collaboration',
      description: 'Seamless communication platform between legal professionals and clients.',
      icon: '👥'
    },
    {
      title: 'Available on Web & Mobile',
      description: 'Access your legal matters anytime, anywhere on any device.',
      icon: '📱'
    }
  ];

  return (
    <section className="section-padding bg-white" id="features">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-black max-w-2xl mx-auto">
            Our platform offers powerful tools to streamline the legal process
          </p>
          <div className="w-20 h-1 bg-green-500 mx-auto mt-4"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-black">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
