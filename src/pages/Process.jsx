import { motion } from "framer-motion";
import {
  Upload,
  Search,
  FileText,
  Code2,
  TestTube,
  Package,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import ShimmerText from "../components/ShimmerText";

const ProcessStep = ({
  number,
  icon: Icon,
  title,
  description,
  details,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative"
  >
    <div className="flex gap-6">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center border-2 border-accent/50 relative z-10">
          <Icon className="w-8 h-8 text-accent" />
        </div>
        <div className="w-0.5 h-full bg-gradient-to-b from-accent/50 to-transparent mt-4" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-16">
        <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-bold mb-3">
          Step {number}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 text-lg mb-4">{description}</p>
        <ul className="space-y-2">
          {details.map((detail, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </motion.div>
);

const Process = () => {
  const steps = [
    {
      icon: Upload,
      title: "Diagnostic Upload",
      description:
        "Share your codebase securely and we'll begin the analysis process.",
      details: [
        "Upload via our AI Sandbox or secure file transfer",
        "NDA & confidentiality agreement signing",
        "Initial codebase structure analysis",
        "Technology stack identification",
      ],
    },
    {
      icon: Search,
      title: "Deep Analysis",
      description:
        "Our AI and expert engineers analyze your code for issues, vulnerabilities, and optimization opportunities.",
      details: [
        "Automated vulnerability scanning",
        "Code quality metrics & complexity analysis",
        "Performance bottleneck identification",
        "Architecture review & recommendations",
        "Technical debt assessment",
      ],
    },
    {
      icon: FileText,
      title: "Repair Plan",
      description:
        "Receive a detailed roadmap with prioritized fixes, timeline, and cost estimates.",
      details: [
        "Comprehensive audit report",
        "Prioritized issue list (Critical → Low)",
        "Estimated timeline & milestones",
        "Cost breakdown & pricing options",
        "Risk assessment & mitigation strategies",
      ],
    },
    {
      icon: Code2,
      title: "Implementation",
      description:
        "Our team implements the repairs with continuous progress tracking and code reviews.",
      details: [
        "Dedicated engineer assignment",
        "Daily progress updates & standups",
        "Live code repair tracking (via /livecodeonline)",
        "Continuous integration & testing",
        "Code review & quality assurance",
      ],
    },
    {
      icon: TestTube,
      title: "Testing & Validation",
      description:
        "Rigorous testing ensures all repairs work correctly and don't introduce regressions.",
      details: [
        "Automated unit & integration tests",
        "End-to-end testing scenarios",
        "Performance benchmarking",
        "Security penetration testing",
        "User acceptance testing (UAT)",
      ],
    },
    {
      icon: Package,
      title: "Delivery & Handoff",
      description:
        "Receive your modernized codebase with complete documentation and ongoing support.",
      details: [
        "Clean, documented code delivery",
        "Migration guide & runbook",
        "Team training & knowledge transfer",
        "30-day post-launch support",
        "Maintenance & monitoring setup",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden bg-gradient-to-b from-primary to-background">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our <ShimmerText className="blue">Process</ShimmerText>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A proven 6-step methodology to transform your legacy codebase into
              a modern, high-performance application.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Process Timeline */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {steps.map((step, i) => (
            <ProcessStep key={i} number={i + 1} {...step} delay={i * 0.1} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            See it in action
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Try our AI Code Repair Sandbox and watch the magic happen in
            real-time.
          </p>
          <a
            href="/livecodeonline"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary rounded-lg font-bold text-lg hover:bg-white transition-all transform hover:scale-105"
          >
            Launch AI Sandbox
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Process;
