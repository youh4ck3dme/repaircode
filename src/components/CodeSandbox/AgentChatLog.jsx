import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Search, Shield, Zap, PenTool, FileText } from "lucide-react";

const AgentChatLog = ({ logs }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getAgentIcon = (agent) => {
    switch (agent) {
      case "Diagnostics":
        return <Search className="w-3 h-3 text-blue-500" />;
      case "Security":
        return <Shield className="w-3 h-3 text-red-500" />;
      case "Performance":
        return <Zap className="w-3 h-3 text-amber-500" />;
      case "Architecture":
        return <PenTool className="w-3 h-3 text-purple-500" />;
      case "Repair":
        return <FileText className="w-3 h-3 text-green-500" />;
      default:
        return <Terminal className="w-3 h-3 text-gray-500" />;
    }
  };

  const getBadgeStyle = (agent) => {
    switch (agent) {
      case "Diagnostics":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
      case "Security":
        return "border-red-500/30 bg-red-500/10 text-red-400";
      case "Performance":
        return "border-amber-500/30 bg-amber-500/10 text-amber-400";
      case "Architecture":
        return "border-purple-500/30 bg-purple-500/10 text-purple-400";
      case "Repair":
        return "border-green-500/30 bg-green-500/10 text-green-400";
      default:
        return "border-gray-500/30 bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <div className="bg-black/40 rounded-xl border border-white/10 overflow-hidden flex flex-col h-[300px]">
      <div className="p-3 border-b border-white/10 flex items-center gap-2 bg-white/5">
        <Terminal className="w-4 h-4 text-gray-400" />
        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
          Záznam komunikácie agentov
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-sm"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3"
            >
              <div
                className={`flex-shrink-0 w-24 px-2 py-0.5 rounded border text-[10px] uppercase font-bold flex items-center justify-center gap-1.5 h-6 ${getBadgeStyle(
                  log.agent
                )}`}
              >
                {getAgentIcon(log.agent)}
                {log.agent}
              </div>
              <p className="text-gray-300 pt-0.5">{log.message}</p>
            </motion.div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-600 italic text-center py-10">
              Čakám na začiatok analýzy...
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AgentChatLog;
