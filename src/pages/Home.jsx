import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Terminal, ShieldCheck, Cpu, Code2 } from "lucide-react";
import ShimmerText from "../components/ShimmerText";

const Hero = () => {
  return (
    <div className="relative pb-16 md:pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-gray-300">
                Available for Emergency Fixes
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Code Repair <br />
            <ShimmerText>Legacy Systems</ShimmerText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10"
          >
            We modernize, optimize, and secure your legacy codebase. Stop
            fighting technical debt and start shipping features again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center gap-4 flex-col sm:flex-row"
          >
            <Link
              to="/livecodeonline"
              className="px-8 py-4 bg-accent text-primary rounded-lg font-bold text-lg hover:bg-white transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Try AI Sandbox
            </Link>
            <Link
              to="/process"
              className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Terminal className="w-5 h-5" />
              View Process
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-8 rounded-2xl bg-surface border border-white/5 hover:border-accent/50 transition-colors group"
  >
    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
      <Icon className="w-6 h-6 text-accent" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Security Hardening",
      description:
        "We patch vulnerabilities, upgrade dependencies, and implement modern security best practices.",
    },
    {
      icon: Cpu,
      title: "Performance Optimization",
      description:
        "Code refactoring, database indexing, and caching strategies to make your app fly.",
    },
    {
      icon: Code2,
      title: "Clean Codebase",
      description:
        "We rewrite spaghetti code into clean, maintainable, and typed modules.",
    },
  ];

  return (
    <div id="services" className="py-24 bg-primary relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-accent font-semibold tracking-wide uppercase">
            Services
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Upgrade Your Technology Stack
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.2} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Stats = () => (
  <div className="py-20 border-y border-white/5 bg-surface/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-surface p-6 rounded-lg">
        {[
          { label: "Lines Repaired", value: "1.2M+" },
          { label: "Apps Modernized", value: "50+" },
          { label: "Bugs Crushed", value: "3.5k+" },
          { label: "Uptime Increase", value: "99.9%" },
        ].map((stat, i) => (
          <div key={i}>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Home = () => {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
    </>
  );
};

export default Home;
