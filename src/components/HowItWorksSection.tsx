const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your account as a citizen or legal professional in just minutes.',
      icon: '👤'
    },
    {
      number: '02',
      title: 'Submit Case/Dispute',
      description: 'Enter your case details or start a dispute resolution process online.',
      icon: '📝'
    },
    {
      number: '03',
      title: 'Get AI Help',
      description: 'Receive instant guidance from our AI legal assistant for common questions.',
      icon: '🤖'
    },
    {
      number: '04',
      title: 'Track Progress',
      description: 'Monitor your case status in real-time with updates and reminders.',
      icon: '📊'
    }
  ];

  return (
    <section className="section-padding bg-green-50" id="how-it-works">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">How It Works</h2>
          <p className="text-black max-w-2xl mx-auto">
            Our platform simplifies the legal process with just a few easy steps
          </p>
          <div className="w-20 h-1 bg-green-500 mx-auto mt-4"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 text-2xl mb-6 mx-auto">
                {step.icon}
              </div>
              <div className="text-center">
                <span className="inline-block text-xs font-bold text-green-600 tracking-wider mb-2">
                  STEP {step.number}
                </span>
                <h3 className="text-xl font-semibold mb-3 text-black">{step.title}</h3>
                <p className="text-black">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
