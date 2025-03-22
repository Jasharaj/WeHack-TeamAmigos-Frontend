import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-24 bg-green-50" id="cta">
      <div className="container-custom mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-4">
            Ready to Transform Your Legal Practice?
          </h2>
          <p className="text-xl text-black mb-8">
            Join thousands of legal professionals and citizens who are already using CasePilot to streamline their legal journey.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              Get Started Now
            </button>
            <button className="px-8 py-3 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
