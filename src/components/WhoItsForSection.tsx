const WhoItsForSection = () => {
  return (
    <section className="py-24 bg-white" id="who-its-for">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">
              Who It's For
            </h2>
            <p className="text-xl text-black">
              CasePilot serves both citizens and legal professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Citizens */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 text-3xl mb-6 mx-auto transform hover:scale-105 transition-transform duration-300">
                👨‍👩‍👧‍👦
              </div>
              <h3 className="text-2xl font-semibold text-center mb-6 text-black hover:text-green-600 transition-colors duration-300">For Citizens</h3>
              <ul className="space-y-4">
                <li className="flex items-start group">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 group-hover:bg-green-200 transition-colors duration-300">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <p className="text-black">Track your cases with real-time updates</p>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 group-hover:bg-green-200 transition-colors duration-300">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <p className="text-black">Get answers to common legal questions instantly</p>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 group-hover:bg-green-200 transition-colors duration-300">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <p className="text-black">Receive reminders for important hearings and deadlines</p>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 group-hover:bg-green-200 transition-colors duration-300">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <p className="text-black">Resolve disputes online without going to court</p>
                </li>
              </ul>
            </div>

            {/* For Lawyers */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 text-3xl mb-6 mx-auto transform hover:scale-105 transition-transform duration-300">
                👨‍⚖️
              </div>
              <h3 className="text-2xl font-semibold text-center mb-6 text-black hover:text-green-600 transition-colors duration-300">For Lawyers</h3>
              <ul className="space-y-4">
                <li className="flex items-start group">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 group-hover:bg-green-200 transition-colors duration-300">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <p className="text-black">Manage multiple cases efficiently in one platform</p>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 group-hover:bg-green-200 transition-colors duration-300">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <p className="text-black">Conduct legal research faster with AI assistance</p>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 group-hover:bg-green-200 transition-colors duration-300">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <p className="text-black">Communicate seamlessly with clients through the platform</p>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1 group-hover:bg-green-200 transition-colors duration-300">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <p className="text-black">Automate routine tasks to focus on complex legal work</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoItsForSection;
