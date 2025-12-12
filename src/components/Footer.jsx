import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="w-6 h-6 text-accent" />
              <span className="font-bold text-xl text-white">RepairCode</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Expert software modernization services. We turn legacy liabilities
              into high-performance assets.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/about"
                  className="hover:text-accent transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-accent transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/process"
                  className="hover:text-accent transition-colors"
                >
                  Process
                </Link>
              </li>
              <li>
                <Link
                  to="/livecodeonline"
                  className="hover:text-accent transition-colors"
                >
                  AI Sandbox
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 text-center text-gray-600 text-sm">
          &copy; 2024 RepairCode Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
