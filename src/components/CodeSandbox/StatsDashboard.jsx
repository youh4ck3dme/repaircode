import { motion } from "framer-motion";
import { FileCode, AlertTriangle, CheckCircle2 } from "lucide-react";

const StatsDashboard = ({ stats, show }) => {
  if (!show) return null;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface/50 rounded-xl border border-white/10 p-4 flex flex-col items-center justify-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500" />
        <FileCode className="w-6 h-6 text-blue-400 mb-2" />
        <span className="text-3xl font-bold text-white mb-1">
          {stats.filesProcessed}
        </span>
        <span className="text-xs text-gray-400 uppercase tracking-widest">
          Naskenovaných súborov
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface/50 rounded-xl border border-white/10 p-4 flex flex-col items-center justify-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors duration-500" />
        <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
        <span className="text-3xl font-bold text-white mb-1">
          {stats.issuesFound}
        </span>
        <span className="text-xs text-gray-400 uppercase tracking-widest">
          Nájdených problémov
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface/50 rounded-xl border border-white/10 p-4 flex flex-col items-center justify-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors duration-500" />
        <CheckCircle2 className="w-6 h-6 text-green-400 mb-2" />
        <span className="text-3xl font-bold text-white mb-1">
          {stats.issuesFixed}
        </span>
        <span className="text-xs text-gray-400 uppercase tracking-widest">
          Opravených
        </span>
      </motion.div>
    </div>
  );
};

export default StatsDashboard;
