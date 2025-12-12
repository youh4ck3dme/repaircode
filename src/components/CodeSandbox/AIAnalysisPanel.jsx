import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import TypewriterText from "../TypewriterText";

const AIAnalysisPanel = ({ issues, isAnalyzing, onApplyFix }) => {
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "border-red-500/50 bg-red-500/10";
      case "warning":
        return "border-yellow-500/50 bg-yellow-500/10";
      case "info":
        return "border-blue-500/50 bg-blue-500/10";
      default:
        return "border-gray-500/50 bg-gray-500/10";
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          AI Analysis
        </h3>
      </div>

      <div className="p-4 space-y-4">
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
              <p className="text-gray-400">
                <TypewriterText text="Analyzing codebase..." delay={50} />
              </p>
              <p className="text-sm text-gray-600 mt-2">
                This may take a few moments
              </p>
            </motion.div>
          ) : issues.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center text-gray-500"
            >
              <Sparkles className="w-12 h-12 mb-4 opacity-50" />
              <p>No analysis yet</p>
              <p className="text-sm mt-2">Upload a file to begin</p>
            </motion.div>
          ) : (
            <motion.div
              key="issues"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {issues.map((issue, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-lg border ${getSeverityColor(
                    issue.severity
                  )}`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white mb-1">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-gray-400 mb-2">
                        {issue.description}
                      </p>
                      {issue.file && (
                        <p className="text-xs text-gray-600">
                          {issue.file}:{issue.line}
                        </p>
                      )}
                    </div>
                  </div>
                  {issue.suggestion && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-gray-400 mb-2">
                        💡 Suggestion:
                      </p>
                      <p className="text-xs text-gray-300">
                        {issue.suggestion}
                      </p>
                      {onApplyFix && (
                        <button
                          onClick={() => onApplyFix(issue)}
                          className="mt-2 px-3 py-1 bg-accent/20 text-accent rounded text-xs font-semibold hover:bg-accent/30 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Apply Fix
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;
