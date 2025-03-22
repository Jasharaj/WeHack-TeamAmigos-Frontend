import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-green-600">CasePilot</span>
            </Link>
            <p className="text-black mb-4 max-w-md">
              A modern LegalTech platform designed to solve delays in the justice system through 
              AI assistance, case tracking, and online dispute resolution.
            </p>
            <p className="text-sm text-black">
              {new Date().getFullYear()} CasePilot. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-black hover:text-green-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-black hover:text-green-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-black hover:text-green-600 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-black hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-black hover:text-green-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-black hover:text-green-600 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
