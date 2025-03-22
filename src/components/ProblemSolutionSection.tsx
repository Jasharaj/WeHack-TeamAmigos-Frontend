import Image from 'next/image';

export default function ProblemSolutionSection() {
  return (
    <section className="section-padding bg-white" id="problem-solution">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-black mb-4">The Problem with Justice Today</h2>
          <div className="w-20 h-1 bg-green-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-black mb-6">Justice Delayed is Justice Denied</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-1">
                  <span className="text-red-500 text-sm">✕</span>
                </div>
                <p className="text-black">Overwhelming case backlogs causing years of delays</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-1">
                  <span className="text-red-500 text-sm">✕</span>
                </div>
                <p className="text-black">Lack of transparency in case status and progress</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-1">
                  <span className="text-red-500 text-sm">✕</span>
                </div>
                <p className="text-black">Difficult access to legal information for citizens</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-1">
                  <span className="text-red-500 text-sm">✕</span>
                </div>
                <p className="text-black">Inefficient communication between lawyers and clients</p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-black mb-6">Our <span className="text-green-600">Solution</span></h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                  <span className="text-green-500 text-sm">✓</span>
                </div>
                <p className="text-black">AI-powered legal assistant for instant guidance and information</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                  <span className="text-green-500 text-sm">✓</span>
                </div>
                <p className="text-black">Transparent case tracking with real-time updates</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                  <span className="text-green-500 text-sm">✓</span>
                </div>
                <p className="text-black">Online Dispute Resolution to settle matters without court</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                  <span className="text-green-500 text-sm">✓</span>
                </div>
                <p className="text-black">Automated reminders for hearings and important deadlines</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
