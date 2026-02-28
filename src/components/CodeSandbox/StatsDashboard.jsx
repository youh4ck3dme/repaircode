import { motion } from "framer-motion";
import { FileSearch, Activity, ShieldCheck } from "lucide-react";

const StatsDashboard = ({ stats, show }) => {
  if (!show) return null;

  const items = [
    {
      label: "Naskenovaných súborov",
      value: stats.filesProcessed,
      icon: FileSearch,
      color: "blue",
      delay: 0
    },
    {
      label: "Nájdených problémov",
      value: stats.issuesFound,
      icon: Activity,
      color: "red",
      delay: 0.1
    },
    {
      label: "Opravených s RubberDuck",
      value: stats.issuesFixed,
      icon: ShieldCheck,
      color: "green",
      delay: 0.2
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: item.delay }}
          className="bg-surface/60 backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex items-center gap-4 group hover:border-primary/30 transition-all duration-300 shadow-xl shadow-black/20"
        >
          <div className={`p-3 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 group-hover:bg-${item.color}-500/20 transition-colors`}>
            <item.icon className={`w-5 h-5 text-${item.color}-400`} />
          </div>
          <div>
            <div className="text-2xl font-black text-white leading-none mb-1">
              {item.value}
            </div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none">
              {item.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsDashboard;
