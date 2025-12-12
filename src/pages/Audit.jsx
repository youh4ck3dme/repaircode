import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import ShimmerText from "../components/ShimmerText";

const Audit = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    email: "",
    company: "",
    techStack: [],
    teamSize: "",
    painPoints: [],
    timeline: "",
    budget: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const techOptions = [
    "React",
    "Vue",
    "Angular",
    "Node.js",
    "Python",
    "PHP",
    "Ruby",
    "Java",
    ".NET",
    "Other",
  ];
  const painPointOptions = [
    "Slow performance",
    "Security vulnerabilities",
    "Hard to maintain",
    "Frequent bugs",
    "Outdated dependencies",
    "Poor test coverage",
    "Deployment issues",
    "Scalability problems",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleArrayItem = (field, value) => {
    const current = formData[field];
    if (current.includes(value)) {
      setFormData({
        ...formData,
        [field]: current.filter((item) => item !== value),
      });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

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
              Get a Free{" "}
              <ShimmerText className="purple">Diagnostic Audit</ShimmerText>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Tell us about your project and receive a comprehensive analysis
              with actionable recommendations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface p-12 rounded-2xl border border-white/5 text-center"
            >
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Audit Request Submitted!
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                Our team will analyze your project and send you a detailed
                diagnostic report within 48 hours.
              </p>
              <p className="text-gray-500">
                Check your email at{" "}
                <span className="text-accent font-semibold">
                  {formData.email}
                </span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-surface p-8 rounded-2xl border border-white/5"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Project Details */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Project Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        name="projectName"
                        required
                        value={formData.projectName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                        placeholder="My Awesome App"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                          placeholder="you@company.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                          placeholder="Acme Inc."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Technology Stack *
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {techOptions.map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleArrayItem("techStack", tech)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          formData.techStack.includes(tech)
                            ? "bg-accent/20 border-accent text-accent"
                            : "bg-background border-white/10 text-gray-400 hover:border-accent/50"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pain Points */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Current Pain Points *
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {painPointOptions.map((point) => (
                      <button
                        key={point}
                        type="button"
                        onClick={() => toggleArrayItem("painPoints", point)}
                        className={`px-4 py-3 rounded-lg border text-left transition-all ${
                          formData.painPoints.includes(point)
                            ? "bg-accent/20 border-accent text-accent"
                            : "bg-background border-white/10 text-gray-400 hover:border-accent/50"
                        }`}
                      >
                        {point}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Size
                    </label>
                    <select
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                    >
                      <option value="">Select...</option>
                      <option value="1-5">1-5 developers</option>
                      <option value="6-10">6-10 developers</option>
                      <option value="11-25">11-25 developers</option>
                      <option value="26+">26+ developers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                    >
                      <option value="">Select...</option>
                      <option value="urgent">Urgent (ASAP)</option>
                      <option value="1-2months">1-2 months</option>
                      <option value="3-6months">3-6 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    formData.techStack.length === 0 ||
                    formData.painPoints.length === 0
                  }
                  className="w-full px-6 py-4 bg-accent text-primary rounded-lg font-bold text-lg hover:bg-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Submit Audit Request
                </button>

                {(formData.techStack.length === 0 ||
                  formData.painPoints.length === 0) && (
                  <div className="flex items-center gap-2 text-yellow-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Please select at least one tech stack and one pain point
                    </span>
                  </div>
                )}
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;
