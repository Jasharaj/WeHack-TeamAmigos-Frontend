'use client';
import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Lightbulb, Zap, Shield } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      icon: MessageCircle,
      question: "How does CasePilot's AI assistant work?",
      answer: "Our AI assistant uses advanced natural language processing to understand your legal queries and provide instant, accurate answers. It's trained on vast legal databases and can help with case research, document drafting, and procedural questions."
    },
    {
      icon: Shield,
      question: "Is my legal information secure on CasePilot?",
      answer: "Absolutely. We use bank-level encryption (AES-256) for all data transmission and storage. Your information is protected by multi-factor authentication, regular security audits, and compliance with international data protection standards."
    },
    {
      icon: Zap,
      question: "How quickly can I get started with CasePilot?",
      answer: "You can start using CasePilot in under 5 minutes. Simply create your account, complete the quick profile setup, and you're ready to track cases, ask legal questions, or connect with lawyers."
    },
    {
      icon: Lightbulb,
      question: "What types of legal cases can CasePilot help with?",
      answer: "CasePilot supports a wide range of legal matters including civil disputes, family law, employment issues, property disputes, contract matters, and more. Our AI is continually updated with the latest legal precedents."
    }
  ];

  const toggleFAQ = (index: number) => {
    console.log('FAQ clicked:', index, 'Current openIndex:', openIndex);
    setOpenIndex(prev => prev === index ? null : index);
  };

  return (
    <section className="py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50" id="faq">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 border border-purple-200 rounded-full text-sm font-medium text-purple-700 mb-6">
            <HelpCircle className="w-4 h-4 mr-2" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Got <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Questions?</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We've got answers! Here are the most common questions about CasePilot.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openIndex === index;
            
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                      isOpen ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {faq.question}
                    </h3>
                  </div>
                  
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div className="px-6 pb-6 border-t border-slate-100">
                    <div className="pl-16 pt-4">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
