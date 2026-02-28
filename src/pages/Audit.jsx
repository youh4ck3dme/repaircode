import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle2, AlertCircle, Users, Clock } from "lucide-react";
import ShimmerText from "../components/ShimmerText";
import PremiumSelect from "../components/PremiumSelect";

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
    "Pomalý výkon",
    "Bezpečnostné zraniteľnosti",
    "Ťažká údržba",
    "Časté chyby",
    "Zastarané závislosti",
    "Nízke pokrytie testami",
    "Problémy s nasadzovaním",
    "Problémy so škálovateľnosťou",
  ];

  const teamSizeOptions = [
    { label: "1–5 vývojárov", value: "1-5", icon: "code", color: "#00c853" },
    { label: "6–10 vývojárov", value: "6-10", icon: "rocket", color: "#2979ff" },
    { label: "11–25 vývojárov", value: "11-25", icon: "gem", color: "#aa00ff" },
    { label: "26+ vývojárov", value: "26+", icon: "crown", color: "#ffab00" },
  ];

  const timelineOptions = [
    { label: "Urgentné (čo najskôr)", value: "urgent", icon: "zap", color: "#ff5252" },
    { label: "1–2 mesiace", value: "1-2months", icon: "flame", color: "#ff9100" },
    { label: "3–6 mesiacov", value: "3-6months", icon: "coffee", color: "#795548" },
    { label: "Flexibilný", value: "flexible", icon: "plane", color: "#00e5ff" },
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

  const setPremiumValue = (field, option) => {
    setFormData((prev) => ({ ...prev, [field]: option.value }));
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
      <div className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-b from-primary to-background">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-accent/10 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Získajte bezplatný{" "}
              <ShimmerText className="purple inline-block">diagnostický audit</ShimmerText>
            </h1>
            <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto">
              Povedzte nám o svojom projekte a dostanete komplexnú analýzu
              s akčnými odporúčaniami.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-8 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface p-8 md:p-12 rounded-3xl border border-white/10 text-center shadow-2xl"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Žiadosť o audit odoslaná!
              </h2>
              <p className="text-gray-400 text-base md:text-lg mb-6">
                Náš tím analyzuje váš projekt a pošle vám podrobnú diagnostickú
                správu do 48 hodín.
              </p>
              <p className="text-gray-500 text-sm md:text-base">
                Skontrolujte váš e-mail na{" "}
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
              className="bg-surface/50 backdrop-blur-xl p-6 md:p-12 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="col-span-full">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-3">
                      <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-xs md:text-sm">01</span>
                      Identita projektu
                    </h3>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-2 md:mb-3 uppercase tracking-wider">
                      Názov projektu *
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      required
                      value={formData.projectName}
                      onChange={handleChange}
                      className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-background/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-all duration-300 focus:ring-4 focus:ring-accent/5 text-sm md:text-base"
                      placeholder="napr. Podnikový cloudový portál"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 md:mb-3 uppercase tracking-wider">
                      Pracovný e-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-background/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-all duration-300 focus:ring-4 focus:ring-accent/5 text-sm md:text-base"
                      placeholder="name@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 md:mb-3 uppercase tracking-wider">
                      Spoločnosť
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-background/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-all duration-300 focus:ring-4 focus:ring-accent/5 text-sm md:text-base"
                      placeholder="Acme Global s.r.o."
                    />
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-3">
                    <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-xs md:text-sm">02</span>
                    Technické DNA
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                    {techOptions.map((tech) => (
                      <motion.button
                        key={tech}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleArrayItem("techStack", tech)}
                        className={`px-3 md:px-4 py-2.5 md:py-3 rounded-xl border transition-all duration-300 font-medium text-xs md:text-sm ${formData.techStack.includes(tech)
                          ? "bg-accent text-primary border-accent shadow-lg shadow-accent/20"
                          : "bg-background/30 border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/5"
                          }`}
                      >
                        {tech}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Pain Points */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-3">
                    <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-xs md:text-sm">03</span>
                    Hlavné výzvy
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {painPointOptions.map((point) => (
                      <motion.button
                        key={point}
                        type="button"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleArrayItem("painPoints", point)}
                        className={`px-4 md:px-5 py-3.5 md:py-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between group text-sm md:text-base ${formData.painPoints.includes(point)
                          ? "bg-accent/10 border-accent text-accent shadow-inner"
                          : "bg-background/30 border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/5"
                          }`}
                      >
                        <span className="font-medium">{point}</span>
                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.painPoints.includes(point)
                          ? "border-accent bg-accent text-primary"
                          : "border-white/20 group-hover:border-white/40"
                          }`}>
                          {formData.painPoints.includes(point) && <CheckCircle2 className="w-2.5 h-2.5 md:w-3 h-3" />}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Logistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="col-span-full">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-3">
                      <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-xs md:text-sm">04</span>
                      Kontext projektu
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-400 mb-3 md:mb-4 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" /> Veľkosť tímu
                    </label>
                    <PremiumSelect
                      options={teamSizeOptions}
                      placeholder="Vyberte veľkosť tímu..."
                      onSelect={(opt) => setPremiumValue("teamSize", opt)}
                      defaultIcon="code"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-400 mb-3 md:mb-4 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" /> Časový rámec
                    </label>
                    <PremiumSelect
                      options={timelineOptions}
                      placeholder="Vyberte požadovanú naliehavosť..."
                      onSelect={(opt) => setPremiumValue("timeline", opt)}
                      defaultIcon="zap"
                    />
                  </div>
                </div>

                <div className="pt-4 md:pt-6">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01, boxShadow: "0 20px 40px -10px rgba(0, 200, 83, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    disabled={
                      formData.techStack.length === 0 ||
                      formData.painPoints.length === 0 ||
                      !formData.projectName ||
                      !formData.email
                    }
                    className="w-full px-6 md:px-8 py-4 md:py-5 bg-accent text-primary rounded-xl md:rounded-2xl font-bold text-lg md:text-xl hover:bg-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl active:scale-95"
                  >
                    <Upload className="w-5 h-5 md:w-6 md:h-6" />
                    Odoslať žiadosť o globálnu analýzu
                  </motion.button>

                  <AnimatePresence>
                    {(formData.techStack.length === 0 || formData.painPoints.length === 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center justify-center gap-2 text-yellow-500/80 mt-6 font-medium text-[10px] md:text-sm text-center px-4"
                      >
                        <AlertCircle className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                        <span>Pre pokračovanie vyberte aspoň jednu technológiu a jednu výzvu</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;
