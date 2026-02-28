import { motion } from "framer-motion";
import { Search, Shield, Zap, PenTool, FileText, CheckCircle2 } from "lucide-react";

const steps = [
  {
    id: "diagnostics",
    label: "Diagnostika",
    icon: Search,
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
    description: "Stack a štruktúra",
  },
  {
    id: "security",
    label: "Bezpečnosť",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/50",
    description: "Skenovanie zraniteľností",
  },
  {
    id: "performance",
    label: "Výkon",
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-500/20",
    borderColor: "border-amber-500/50",
    description: "Analýza úzkych hrdiel",
  },
  {
    id: "architecture",
    label: "Architektúra",
    icon: PenTool,
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/50",
    description: "Revízia dizajnu",
  },
  {
    id: "repair",
    label: "Plán opravy",
    icon: FileText,
    color: "text-green-500",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/50",
    description: "Generovanie cestovnej mapy",
  },
];

const PipelineVisualization = ({ currentStage }) => {
  return (
    <div className="flex items-center justify-between relative px-8 py-6 mb-8 bg-surface/30 rounded-xl border border-white/5">
      {/* Connector Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -z-10" />
      <div
        className="absolute top-1/2 left-0 h-1 bg-accent/20 -z-10 transition-all duration-1000"
        style={{
          width:
            currentStage === "diagnostics"
              ? "10%"
              : currentStage === "security"
                ? "30%"
                : currentStage === "performance"
                  ? "50%"
                  : currentStage === "architecture"
                    ? "70%"
                    : currentStage === "repair"
                      ? "90%"
                      : "100%",
        }}
      />

      {steps.map((step) => {
        const isActive = currentStage === step.id;
        const isCompleted =
          (currentStage === "security" && step.id === "diagnostics") ||
          (currentStage === "performance" && ["diagnostics", "security"].includes(step.id)) ||
          (currentStage === "architecture" && ["diagnostics", "security", "performance"].includes(step.id)) ||
          (currentStage === "repair" && ["diagnostics", "security", "performance", "architecture"].includes(step.id)) ||
          currentStage === "completed";

        return (
          <div key={step.id} className="relative flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1.1 : 1,
                borderColor:
                  isActive || isCompleted
                    ? step.borderColor
                    : "rgba(255,255,255,0.1)",
                backgroundColor: isActive ? step.bgColor : "rgba(0,0,0,0.2)",
              }}
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-3 transition-colors duration-500 backdrop-blur-sm z-10 ${isActive ? "shadow-lg shadow-accent/10" : ""
                }`}
            >
              {isCompleted ? (
                <CheckCircle2 className={`w-8 h-8 ${step.color}`} />
              ) : (
                <step.icon
                  className={`w-8 h-8 ${isActive ? step.color : "text-gray-600"
                    }`}
                />
              )}
            </motion.div>

            <div className="text-center">
              <h4
                className={`text-sm font-bold ${isActive ? "text-white" : "text-gray-500"
                  }`}
              >
                {step.label}
              </h4>
              <p
                className={`text-xs ${isActive ? "text-accent" : "text-transparent"
                  } transition-colors duration-300 h-4`}
              >
                {isActive ? "Spracovávam..." : isCompleted ? "Hotovo" : ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineVisualization;
