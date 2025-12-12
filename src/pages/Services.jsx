import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Cpu,
  Code2,
  TestTube,
  Cloud,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import ShimmerText from "../components/ShimmerText";

const ServiceCard = ({ icon: Icon, title, description, features, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-8 rounded-2xl bg-surface border border-white/5 hover:border-accent/50 transition-all group"
  >
    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
      <Icon className="w-8 h-8 text-accent" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed mb-6">{description}</p>
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2 text-gray-300">
          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const Services = () => {
  const services = [
    {
      icon: ShieldCheck,
      title: "Security Hardening",
      description:
        "Protect your application from vulnerabilities and threats with comprehensive security audits and implementations.",
      features: [
        "Dependency vulnerability scanning & patching",
        "SQL injection & XSS prevention",
        "Authentication & authorization upgrades",
        "Security headers & CSP implementation",
        "Penetration testing & threat modeling",
      ],
    },
    {
      icon: Cpu,
      title: "Performance Optimization",
      description:
        "Make your application blazing fast with advanced optimization techniques and best practices.",
      features: [
        "Database query optimization & indexing",
        "Code profiling & bottleneck identification",
        "Caching strategies (Redis, CDN)",
        "Lazy loading & code splitting",
        "Server-side rendering optimization",
      ],
    },
    {
      icon: Code2,
      title: "Code Modernization",
      description:
        "Transform legacy code into clean, maintainable, and type-safe modern architecture.",
      features: [
        "Refactoring spaghetti code to clean patterns",
        "TypeScript migration",
        "Modern framework upgrades (React, Vue, Angular)",
        "API redesign & documentation",
        "Component library creation",
      ],
    },
    {
      icon: TestTube,
      title: "Testing & QA",
      description:
        "Ensure reliability with comprehensive testing strategies and quality assurance processes.",
      features: [
        "Unit & integration test implementation",
        "E2E testing with Playwright/Cypress",
        "Test coverage analysis",
        "CI/CD pipeline setup",
        "Automated regression testing",
      ],
    },
    {
      icon: Cloud,
      title: "DevOps & Infrastructure",
      description:
        "Streamline deployment and operations with modern DevOps practices and cloud infrastructure.",
      features: [
        "Docker containerization",
        "Kubernetes orchestration",
        "CI/CD automation (GitHub Actions, GitLab)",
        "Cloud migration (AWS, GCP, Azure)",
        "Monitoring & logging setup",
      ],
    },
    {
      icon: TrendingDown,
      title: "Technical Debt Reduction",
      description:
        "Systematically eliminate technical debt and improve codebase maintainability.",
      features: [
        "Code smell identification & removal",
        "Dependency cleanup & updates",
        "Documentation generation",
        "Architecture refactoring",
        "Legacy system migration planning",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden bg-gradient-to-b from-primary to-background">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our <ShimmerText className="purple">Services</ShimmerText>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive code repair and modernization services to transform
              your legacy systems into high-performance applications.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <ServiceCard key={i} {...service} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to modernize your codebase?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Get a free diagnostic audit and see how we can help transform your
            application.
          </p>
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary rounded-lg font-bold text-lg hover:bg-white transition-all transform hover:scale-105"
          >
            Get Free Audit
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
