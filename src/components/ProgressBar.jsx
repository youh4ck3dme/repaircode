import { motion } from "framer-motion";

const ProgressBar = ({
  progress = 0,
  label,
  showPct = true,
  className = "",
  barColor = "bg-accent",
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={className}>
      <div className="relative h-3 md:h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <motion.div
          className={`absolute inset-y-0 left-0 ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {(label || showPct) && (
        <div className="mt-2 flex justify-between text-[10px] text-gray-500 font-mono">
          {label && <span>{label}</span>}
          {showPct && <span>STAV: {clamped}%</span>}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
