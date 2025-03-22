'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is CasePilot?",
    answer: "CasePilot is a modern LegalTech platform designed to solve delays in the justice system. It provides tools for case tracking, AI-powered legal assistance, online dispute resolution, and collaboration between lawyers and citizens."
  },
  {
    question: "How does the AI legal assistant work?",
    answer: "Our AI legal assistant uses advanced natural language processing to help you understand legal terminology, draft documents, and provide preliminary guidance on common legal questions. It's designed to assist, not replace, legal professionals."
  },
  {
    question: "Is CasePilot suitable for all types of legal cases?",
    answer: "CasePilot is designed to handle a wide range of civil cases and disputes. While it's especially effective for property disputes, consumer complaints, and contract disagreements, it may not be suitable for complex criminal cases that require extensive court proceedings."
  },
  {
    question: "How secure is my legal information on CasePilot?",
    answer: "We take security very seriously. CasePilot employs bank-level encryption for all data, strict access controls, and regular security audits. Your legal information is protected with the highest industry standards for confidentiality and data protection."
  },
  {
    question: "Can I use CasePilot if I already have a lawyer?",
    answer: "Absolutely! CasePilot is designed to enhance collaboration between you and your legal representation. Your lawyer can be added to your case, access relevant documents, and communicate with you through our secure platform."
  },
  {
    question: "How does online dispute resolution work?",
    answer: "Our online dispute resolution system provides a structured digital environment for parties to present their case, negotiate, and reach agreements with optional mediation support. It reduces the need for in-person hearings and speeds up the resolution process significantly."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-green-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Frequently Asked Questions</h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Everything you need to know about CasePilot before getting started.
          </p>
          <div className="w-20 h-1 bg-green-500 mx-auto mt-4"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`mb-6 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                openIndex === index 
                  ? 'border-green-300 bg-white' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none ${
                  openIndex === index ? 'bg-green-50' : 'bg-white'
                }`}
              >
                <span className={`text-lg font-medium ${
                  openIndex === index ? 'text-green-700' : 'text-black'
                }`}>{faq.question}</span>
                <span className={`transition-transform duration-300 transform ${
                  openIndex === index ? 'text-green-600' : 'text-green-500'
                }`}>
                  {openIndex === index ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                }`}
              >
                <p className="text-black">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
