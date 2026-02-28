/* eslint-disable react-refresh/only-export-components */
import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

let _addToast = null;

export const useToasts = () => {
  const show = useCallback((message, type = "info", duration = 4000) => {
    if (_addToast) _addToast({ message, type, duration, id: Date.now() });
  }, []);
  return { show };
};

const ICONS = {
  success: <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
  info: <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />,
};

const BORDER = {
  success: "border-accent/30",
  error: "border-red-500/30",
  info: "border-blue-500/30",
};

const SingleToast = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-surface/90 backdrop-blur-xl border ${BORDER[toast.type] ?? "border-white/10"} shadow-2xl min-w-[260px] max-w-sm`}
    >
      {ICONS[toast.type]}
      <p className="text-sm text-gray-200 flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

const ToastManager = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _addToast = (toast) => setToasts((prev) => [...prev, toast]);
    return () => {
      _addToast = null;
    };
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <SingleToast toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default ToastManager;
