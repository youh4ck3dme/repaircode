import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Menu, X, Download, LayoutDashboard, Info, Mail, Zap, Github, Rocket } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const location = useLocation();
  const { lang, t, toggleLang } = useLanguage();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const navItems = [
    { name: t("nav.services"), path: "/services", icon: Zap },
    { name: t("nav.process"), path: "/process", icon: LayoutDashboard },
    { name: t("nav.aiSandbox"), path: "/livecodeonline", icon: Code2 },
    { name: t("nav.spaceCode"), path: "/spacecode", icon: Rocket },
    { name: t("nav.about"), path: "/about", icon: Info },
    { name: t("nav.contact"), path: "/contact", icon: Mail },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <img src="/logo.png" className="w-8 h-8 group-hover:scale-110 transition-transform" alt="" />
              <span className="font-bold text-2xl tracking-tighter text-white">
                RubberDuck<span className="text-primary">.Space</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-baseline space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-[11px] font-bold transition-colors uppercase tracking-wider relative ${isActive(item.path)
                      ? "text-accent"
                      : "text-gray-300 hover:text-accent"
                      }`}
                  >
                    {item.name}
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                <button
                  onClick={toggleLang}
                  className="flex items-center gap-1 text-xs font-bold border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/5 transition-all text-gray-300 hover:text-white"
                  aria-label="Switch language"
                >
                  <span className={lang === "sk" ? "text-accent" : "text-gray-500"}>SK</span>
                  <span className="text-gray-600">/</span>
                  <span className={lang === "en" ? "text-accent" : "text-gray-500"}>EN</span>
                </button>
                {isInstallable && (
                  <button
                    onClick={handleInstallClick}
                    className="flex items-center gap-2 text-xs font-bold text-accent border border-accent/30 px-3 py-1.5 rounded-full hover:bg-accent/10 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {t("nav.install")}
                  </button>
                )}
                <a
                  href={import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/github/login` : "/api/github/login"}
                  className="flex items-center gap-2 text-xs font-bold text-gray-300 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/5 transition-all hover:text-white"
                >
                  <Github className="w-4 h-4" />
                  Connect
                </a>
                <Link
                  to="/audit"
                  className="bg-accent text-black px-6 py-2.5 rounded-xl font-bold hover:bg-white transition-all shadow-lg shadow-accent/20 active:scale-95"
                >
                  {t("nav.getAudit")}
                </Link>
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center md:hidden gap-4">
              {isInstallable && (
                <button
                  onClick={handleInstallClick}
                  className="p-2 bg-accent/10 rounded-lg text-accent"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-background border-l border-white/10 z-[70] md:hidden p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" className="w-6 h-6" alt="" />
                  <span className="font-bold text-xl text-white">RubberDuck<span className="text-primary">.Space</span></span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-white/5 rounded-full text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl text-[15px] font-medium transition-all ${isActive(item.path)
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto space-y-4">
                <button
                  onClick={toggleLang}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold text-sm"
                >
                  <span className={lang === "sk" ? "text-accent" : ""}>SK</span>
                  <span className="text-gray-600">/</span>
                  <span className={lang === "en" ? "text-accent" : ""}>EN</span>
                </button>
                <Link
                  to="/audit"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-accent text-black py-4 rounded-2xl font-bold text-lg shadow-xl shadow-accent/20"
                >
                  <Zap className="w-5 h-5" />
                  {t("nav.getAudit")}
                </Link>
                <p className="text-center text-gray-600 text-xs">
                  Enterprise Ready &bull; AI Powered
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

