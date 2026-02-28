import { WifiOff, Home, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import ParticleBackground from "../components/ParticleBackground";

const OfflineFallback = () => {
    const reloadPage = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-background text-white flex flex-center relative overflow-hidden">
            <ParticleBackground />

            <div className="relative z-10 max-w-md w-full px-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="p-6 bg-accent/10 rounded-full border border-accent/20">
                        <WifiOff className="w-16 h-16 text-accent" />
                    </div>
                </motion.div>

                <h1 className="text-3xl font-bold mb-4">Ste offline</h1>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    Vyzerá to, že vaše internetové pripojenie bolo prerušené. Väčšina funkcií RepairCode vyžaduje aktívne pripojenie pre AI analýzu.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={reloadPage}
                        className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 group"
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Skúsiť znova
                    </button>

                    <a
                        href="/"
                        className="w-full bg-white/5 border border-white/10 text-white font-medium py-3 px-6 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Späť na úvod
                    </a>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-xs text-gray-500">
                    <p>RepairCode Enterprise &bull; Offline Mode v1.0</p>
                </div>
            </div>
        </div>
    );
};

export default OfflineFallback;
