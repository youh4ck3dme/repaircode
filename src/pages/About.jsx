import { motion } from "framer-motion";
import { Code2, Users, Target, Zap } from "lucide-react";
import ShimmerText from "../components/ShimmerText";

const About = () => {
  const values = [
    {
      icon: Code2,
      title: "Code Excellence",
      description:
        "We believe in writing clean, maintainable code that stands the test of time.",
    },
    {
      icon: Users,
      title: "Client Partnership",
      description:
        "Your success is our success. We work as an extension of your team.",
    },
    {
      icon: Target,
      title: "Results Driven",
      description:
        "We focus on measurable outcomes: faster performance, fewer bugs, happier developers.",
    },
    {
      icon: Zap,
      title: "Innovation First",
      description:
        "We leverage cutting-edge AI and automation to deliver faster, smarter solutions.",
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
              About <ShimmerText className="pink">RepairCode</ShimmerText>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We&apos;re on a mission to eliminate technical debt and empower
              development teams to ship faster.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-invert max-w-none"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">
              RepairCode was founded by a team of senior engineers who spent
              years battling legacy codebases at Fortune 500 companies. We saw
              talented developers waste countless hours debugging ancient code
              instead of building new features.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">
              We knew there had to be a better way. By combining AI-powered
              analysis with expert human engineering, we created a systematic
              approach to modernizing legacy systems without the risk of
              traditional rewrites.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Today, we&apos;ve helped over 50 companies transform their
              codebases, eliminating millions of lines of technical debt and
              unlocking developer productivity.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-gray-400 text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl bg-surface border border-white/5 text-center"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Years Experience", value: "10+" },
              { label: "Projects Completed", value: "50+" },
              { label: "Lines Modernized", value: "1.2M+" },
              { label: "Client Satisfaction", value: "99%" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
