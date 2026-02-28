import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" className="w-8 h-8" alt="" />
              <span className="font-bold text-2xl text-white">RubberDuck<span className="text-primary">.Space</span></span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Advanced AI-driven repository modernization and surgical repair.
              Making legacy code high-performance and future-proof.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Spoločnosť</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/about"
                  className="hover:text-accent transition-colors"
                >
                  O nás
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-accent transition-colors"
                >
                  Služby
                </Link>
              </li>
              <li>
                <Link
                  to="/process"
                  className="hover:text-accent transition-colors"
                >
                  Postup
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
            <h4 className="text-white font-bold mb-4">Právne</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Ochrana súkromia
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Podmienky
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 text-center text-gray-600 text-sm">
          &copy; 2024 RubberDuck.Space AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
