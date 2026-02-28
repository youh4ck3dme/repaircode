import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import LoadingSkeleton from "../LoadingSkeleton";
import { useLanguage } from "../../contexts/LanguageContext";

const AIAnalysisPanel = ({ issues, isAnalyzing, onApplyFix }) => {
  const { t } = useLanguage();
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
          {t("analysis.title")}
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
            >
              <LoadingSkeleton lines={4} showAvatar={true} loadingText={t("analysis.analyzing")} />
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
              <p>{t("analysis.empty")}</p>
              <p className="text-sm mt-2">{t("analysis.emptySub")}</p>
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
                      <p className="text-xs text-gray-400 mb-2 whitespace-pre-line">
                        {issue.description}
                      </p>
                      {issue.file && (
                        <p className="text-xs text-gray-600">
                          {issue.file}{issue.line ? `:${issue.line}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  {issue.suggestion && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-gray-400 mb-2">
                        💡 Návrh / Príkaz opravy:
                      </p>
                      <p className="text-xs text-gray-300 font-mono bg-black/20 p-2 rounded border border-white/5">
                        {issue.suggestion}
                      </p>
                      {onApplyFix && (
                        <button
                          onClick={() => onApplyFix(issue)}
                          className="mt-2 px-3 py-1 bg-accent/20 text-accent rounded text-xs font-semibold hover:bg-accent/30 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {t("analysis.applyFix")}
                        </button>
                      )}
                    </div>
                  )}

                  {issue.prTemplate && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <p className="text-xs text-blue-400 mb-2 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Vygenerovaná šablóna PR
                      </p>
                      <div className="bg-black/30 p-3 rounded-lg border border-blue-500/20">
                        <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
                          <span className="text-xs font-bold text-white">{issue.prTemplate.title}</span>
                          <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                            {issue.prTemplate.branch_name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 whitespace-pre-line mb-3">
                          {issue.prTemplate.body_markdown}
                        </p>
                        <div className="text-[10px] text-gray-500">
                          <strong>Testy na spustenie:</strong> {issue.prTemplate.tests_to_run?.join(", ")}
                        </div>
                      </div>
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
