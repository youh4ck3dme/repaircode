import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Satellite,
  Rocket,
  ShieldCheck,
  TestTube2,
  Clock,
  GitPullRequest,
  Zap,
  Globe,
  ChevronRight,
} from "lucide-react";

/* ─── tiny helpers ─────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

/* ─── data ─────────────────────────────────────────────── */
const ORBIT_STEPS = [
  {
    num: "01",
    icon: Satellite,
    title: "INGEST",
    color: "text-cyber",
    borderColor: "border-cyber/30",
    glowColor: "shadow-[0_0_20px_rgba(0,245,255,0.15)]",
    desc: "Napojíme sa na vaše repo (GitHub / GitLab). Náš agent naskenuje kontext, typy a históriu commitov.",
  },
  {
    num: "02",
    icon: null, // duck logo
    title: "COMPUTE",
    color: "text-primary",
    borderColor: "border-primary/30",
    glowColor: "shadow-[0_0_20px_rgba(255,215,0,0.15)]",
    desc: "Keď nastane chyba, agent ju izoluje v sandboxe. Simuluje 'rubber ducking', hľadá root cause a navrhuje fix.",
  },
  {
    num: "03",
    icon: Rocket,
    title: "DEPLOY",
    color: "text-cyber",
    borderColor: "border-cyber/30",
    glowColor: "shadow-[0_0_20px_rgba(0,245,255,0.15)]",
    desc: "Agent spustí testy. Ak prejdú, otvorí chirurgicky presný Pull Request s vysvetlením. Vy len kliknete 'Merge'.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    color: "text-cyber",
    title: "Enterprise-Grade Guardrails",
    desc: "Kód neopustí vašu VPC. Žiadny tréning na vašich dátach. GDPR & SOC 2 kompatibilné.",
  },
  {
    icon: TestTube2,
    color: "text-primary",
    title: "Test-Driven Repairs",
    desc: "Agent nikdy nenavrhne kód bez toho, aby k nemu nenapísal a nespustil unit testy.",
  },
  {
    icon: Clock,
    color: "text-cyber",
    title: "Full Audit Trails",
    desc: "Každé rozhodnutie AI je zaznamenané a exportovateľné pre compliance review.",
  },
  {
    icon: GitPullRequest,
    color: "text-primary",
    title: "Auto PR Generation",
    desc: "Chirurgicky presné Pull Requesty s popisom, diff viewom a odkazom na issue.",
  },
  {
    icon: Zap,
    color: "text-cyber",
    title: "Sub-60s Response",
    desc: "Patch hotový skôr ako dopijete kávu. Paralelné agenty pracujú súčasne.",
  },
  {
    icon: Globe,
    color: "text-primary",
    title: "Multi-Language Support",
    desc: "TypeScript, Python, Go, Rust, Java, PHP. Framework-agnostické riešenie.",
  },
];

const TRUSTED_BRANDS = ["Vercel", "Stripe", "Shopify", "GitHub", "Linear", "Figma"];

/* ─── broken code snippet ───────────────────────────────── */
const BROKEN_LINES = [
  { n: "01", code: "async function processPayment(order) {", err: false },
  { n: "02", code: "  const gateway = getGateway();", err: false },
  { n: "03", code: "  const result = await gateway.charge(", err: false },
  { n: "04", code: "    order.amount,", err: true },
  { n: "05", code: "    order.card.token  // ← NullRef", err: true },
  { n: "06", code: "  );", err: false },
  { n: "07", code: "  return result;", err: false },
  { n: "08", code: "}", err: false },
];

const FIXED_LINES = [
  { n: "01", code: "async function processPayment(order) {", added: false },
  { n: "02", code: "  const gateway = getGateway();", added: false },
  { n: "03", code: "  if (!order?.card?.token) {", added: true },
  { n: "04", code: "    throw new PaymentError('No card');", added: true },
  { n: "05", code: "  }", added: true },
  { n: "06", code: "  const result = await gateway.charge(", added: false },
  { n: "07", code: "    order.amount,", added: false },
  { n: "08", code: "    order.card.token", added: false },
];

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
export default function SpaceCode() {
  const [terminalActive, setTerminalActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTerminalActive(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">

      {/* ── Fixed space background ────────────────────────── */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('/wall.jpg')" }}
      />

      {/* ── Circuit pulse overlay ─────────────────────────── */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,245,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-28 flex flex-col items-center text-center px-4">

        {/* logo */}
        <motion.div {...fadeUp(0)} className="mb-8">
          <img
            src="/logo.png"
            alt="RubberDuck"
            className="w-36 md:w-48 mx-auto drop-shadow-[0_0_40px_rgba(255,215,0,0.35)]"
          />
          {/* reflection */}
          <img
            src="/logo.png"
            alt=""
            aria-hidden
            className="w-36 md:w-48 mx-auto opacity-10 blur-sm scale-y-[-1] -mt-6 pointer-events-none"
          />
        </motion.div>

        {/* headline */}
        <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
          <span
            className="text-primary"
            style={{ textShadow: "0 0 30px rgba(255,215,0,0.5)" }}
          >
            AUTONOMOUS CODE REPAIR.
          </span>
          <br />
          <span className="text-white">FROM ORBIT.</span>
        </motion.h1>

        {/* sub */}
        <motion.p {...fadeUp(0.2)} className="max-w-2xl text-lg text-gray-400 mb-10">
          Váš AI &ldquo;Rubber Duck&rdquo;, ktorý nielen počúva, ale aj koná.
          Diagnostikuje chyby, píše testy a otvára PR, kým spíte.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/audit"
            className="btn-primary flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base"
          >
            START MISSION
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            to="/livecodeonline"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base border border-cyber/50 text-cyber hover:bg-cyber/10 transition-all"
            style={{ boxShadow: "0 0 20px rgba(0,245,255,0.1)" }}
          >
            VIEW FLIGHT DATA
          </Link>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          SOCIAL PROOF STRIP
      ══════════════════════════════════════════════════ */}
      <div className="border-y border-white/10 backdrop-blur-sm py-6 px-4">
        <p className="text-center text-[10px] font-bold tracking-[0.3em] text-gray-500 mb-5">
          TRUSTED BY ENGINEERING TEAMS ACROSS THE GALAXY
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {TRUSTED_BRANDS.map((brand) => (
            <span
              key={brand}
              className="text-sm font-bold text-gray-600 hover:text-cyber transition-colors tracking-wider"
              style={{ textShadow: "0 0 8px rgba(0,245,255,0)" }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <p className="text-[11px] font-bold tracking-[0.3em] text-cyber mb-3">THE ORBITAL PROCESS</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Three Steps to{" "}
            <span className="text-primary" style={{ textShadow: "0 0 20px rgba(255,215,0,0.4)" }}>
              Zero Bugs
            </span>
          </h2>
        </motion.div>

        {/* cards + connector */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* connector line (desktop only) */}
          <div className="hidden md:block absolute top-[72px] left-[calc(16.66%+12px)] right-[calc(16.66%+12px)] h-px bg-gradient-to-r from-cyber via-primary to-cyber opacity-30" />

          {ORBIT_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.num} {...fadeUp(i * 0.15)}>
                <div
                  className={`glass-premium rounded-2xl p-6 h-full border ${step.borderColor} ${step.glowColor} transition-all hover:scale-[1.02]`}
                >
                  {/* icon circle */}
                  <div className={`w-14 h-14 rounded-full border ${step.borderColor} flex items-center justify-center mb-5 bg-black/20`}>
                    {Icon ? (
                      <Icon className={`w-6 h-6 ${step.color}`} />
                    ) : (
                      <img src="/logo.png" alt="" className="w-8 h-8 animate-pulse" />
                    )}
                  </div>

                  <p className={`text-[11px] font-black tracking-[0.3em] ${step.color} mb-1`}>
                    {step.num}
                  </p>
                  <h3 className="text-xl font-black mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TERMINAL DEMO
      ══════════════════════════════════════════════════ */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <p className="text-[11px] font-bold tracking-[0.3em] text-cyber mb-3">HOLOGRAPHIC INTERFACE</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Watch the{" "}
            <span className="text-primary" style={{ textShadow: "0 0 20px rgba(255,215,0,0.4)" }}>
              Agent Work
            </span>
          </h2>
        </motion.div>

        <motion.div
          {...fadeUp(0.1)}
          className="glass-premium rounded-2xl overflow-hidden border border-white/10"
          style={{ boxShadow: "0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,245,255,0.05)" }}
        >
          {/* terminal top bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-black/30">
            <span className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
            <span className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
            <span className="ml-4 text-xs text-gray-500 font-mono">payment_gateway.ts — RubberDuck Agent v2.0</span>
          </div>

          {/* split panes */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
            {/* LEFT – broken */}
            <div className="p-5 font-mono text-xs">
              <p className="text-[10px] font-bold tracking-[0.25em] text-red-400 mb-3">
                ● SYSTEM ERROR DETECTED
              </p>
              {BROKEN_LINES.map((l) => (
                <div
                  key={l.n}
                  className={`flex gap-3 py-0.5 px-2 rounded ${
                    l.err
                      ? "bg-red-900/30 border-l-2 border-red-500"
                      : ""
                  }`}
                >
                  <span className="text-gray-600 select-none w-5 shrink-0">{l.n}</span>
                  <span className={l.err ? "text-red-300" : "text-gray-300"}>{l.code}</span>
                </div>
              ))}
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] text-red-400 font-bold">
                  [ERROR] NullReferenceException in payment_gateway.ts:5
                </span>
              </div>
            </div>

            {/* CENTER – duck */}
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-6 border-x border-white/10">
              <motion.img
                src="/logo.png"
                alt="Processing"
                className="w-10 h-10"
                animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              {terminalActive && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 32 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="h-0.5 bg-gradient-to-r from-cyber to-primary"
                />
              )}
              <span className="text-[9px] text-gray-500 tracking-widest font-bold text-center">
                ANALYZING
              </span>
            </div>

            {/* RIGHT – fixed */}
            <div className="p-5 font-mono text-xs">
              <p className="text-[10px] font-bold tracking-[0.25em] text-green-400 mb-3">
                ● SYSTEM STABLE
              </p>
              {FIXED_LINES.map((l) => (
                <div
                  key={l.n}
                  className={`flex gap-3 py-0.5 px-2 rounded ${
                    l.added
                      ? "bg-primary/10 border-l-2 border-primary"
                      : ""
                  }`}
                >
                  <span className="text-gray-600 select-none w-5 shrink-0">{l.n}</span>
                  <span
                    className={l.added ? "text-primary" : "text-gray-300"}
                    style={l.added ? { textShadow: "0 0 8px rgba(255,215,0,0.4)" } : {}}
                  >
                    {l.code}
                  </span>
                </div>
              ))}
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-green-400 font-bold">
                  [SUCCESS] 14 tests passed · PR #404 ready
                </span>
              </div>
            </div>
          </div>

          {/* CRT vignette */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 65%, rgba(0,0,0,0.45) 100%)",
            }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURE GRID
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <p className="text-[11px] font-bold tracking-[0.3em] text-cyber mb-3">SYSTEM MODULES</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Built for{" "}
            <span className="text-primary" style={{ textShadow: "0 0 20px rgba(255,215,0,0.4)" }}>
              Production
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} {...fadeUp(i * 0.08)}>
                <div className="glass-card rounded-2xl p-6 h-full hover:border-primary/30 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                      <Icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white mb-1">{f.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════ */}
      <section className="py-28 px-4 text-center">
        <motion.div {...fadeUp(0)} className="max-w-3xl mx-auto">
          <div className="glass-premium rounded-3xl p-12 border border-primary/20"
               style={{ boxShadow: "0 0 60px rgba(255,215,0,0.08)" }}>
            <img src="/logo.png" alt="" className="w-16 h-16 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]" />
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Ready for{" "}
              <span className="text-primary" style={{ textShadow: "0 0 20px rgba(255,215,0,0.5)" }}>
                Liftoff?
              </span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Bezplatný diagnostický audit. Bez záväzkov. Výsledky do 24 hodín.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/audit"
                className="btn-primary flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-base"
              >
                <Rocket className="w-5 h-5" />
                LAUNCH MISSION
              </Link>
              <Link
                to="/livecodeonline"
                className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-base border border-white/20 text-gray-300 hover:bg-white/5 transition-all"
              >
                Try AI Sandbox
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
