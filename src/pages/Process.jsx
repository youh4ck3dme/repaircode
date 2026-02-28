import { motion } from "framer-motion";
import {
  Upload,
  Search,
  FileText,
  Code2,
  TestTube,
  Package,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import ShimmerText from "../components/ShimmerText";

const ProcessStep = ({
  number,
  icon: Icon,
  title,
  description,
  details,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative"
  >
    <div className="flex gap-6">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center border-2 border-accent/50 relative z-10">
          <Icon className="w-8 h-8 text-accent" />
        </div>
        <div className="w-0.5 h-full bg-gradient-to-b from-accent/50 to-transparent mt-4" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-16">
        <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-bold mb-3">
          Krok {number}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 text-lg mb-4">{description}</p>
        <ul className="space-y-2">
          {details.map((detail, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </motion.div>
);

const Process = () => {
  const steps = [
    {
      icon: Upload,
      title: "Diagnostické nahranie",
      description:
        "Bezpečne zdieľajte svoju kódovú základňu a my začneme proces analýzy.",
      details: [
        "Nahranie cez náš AI Sandbox alebo bezpečný prenos súborov",
        "Podpis NDA a dohody o mlčanlivosti",
        "Počiatočná analýza štruktúry kódovej základne",
        "Identifikácia technologického stacku",
      ],
    },
    {
      icon: Search,
      title: "Hĺbková analýza",
      description:
        "Naša AI a expert inžinieri analyzujú váš kód na problémy, zraniteľnosti a možnosti optimalizácie.",
      details: [
        "Automatizované skenovanie zraniteľností",
        "Metriky kvality kódu a analýza komplexnosti",
        "Identifikácia výkonnostných úzkych hrdiel",
        "Revízia architektúry a odporúčania",
        "Posúdenie technického dlhu",
      ],
    },
    {
      icon: FileText,
      title: "Plán opravy",
      description:
        "Získajte podrobnú cestovnú mapu s prioritizovanými opravami, časovým harmonogramom a odhadmi nákladov.",
      details: [
        "Komplexná správa auditu",
        "Prioritizovaný zoznam problémov (Kritické → Nízke)",
        "Odhadovaný harmonogram a míľniky",
        "Rozčlenenie nákladov a cenové možnosti",
        "Posúdenie rizík a stratégie zmierňovania",
      ],
    },
    {
      icon: Code2,
      title: "Implementácia",
      description:
        "Náš tím implementuje opravy s priebežným sledovaním pokroku a kontrolou kódu.",
      details: [
        "Priradenie dedikovaného inžiniera",
        "Denné aktualizácie pokroku a standupy",
        "Sledovanie opravy kódu naživo (cez /livecodeonline)",
        "Kontinuálna integrácia a testovanie",
        "Kontrola kódu a zabezpečenie kvality",
      ],
    },
    {
      icon: TestTube,
      title: "Testovanie a validácia",
      description:
        "Dôsledné testovanie zabezpečuje správnu funkčnosť všetkých opráv bez zavedenia regresií.",
      details: [
        "Automatizované unit a integračné testy",
        "Scenáre testovania end-to-end",
        "Výkonnostný benchmarking",
        "Bezpečnostné penetračné testovanie",
        "Akceptačné testovanie používateľom (UAT)",
      ],
    },
    {
      icon: Package,
      title: "Dodanie a odovzdanie",
      description:
        "Získajte modernizovanú kódovú základňu s kompletnou dokumentáciou a priebežnou podporou.",
      details: [
        "Dodanie čistého, dokumentovaného kódu",
        "Príručka migrácie a runbook",
        "Školenie tímu a odovzdanie znalostí",
        "30-dňová podpora po spustení",
        "Nastavenie údržby a monitorovania",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden bg-gradient-to-b from-primary to-background">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <ShimmerText className="blue">Náš postup</ShimmerText>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Osvedčená 6-kroková metodológia na transformáciu zastaraného kódu
              na modernú, výkonnú aplikáciu.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Process Timeline */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {steps.map((step, i) => (
            <ProcessStep key={i} number={i + 1} {...step} delay={i * 0.1} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pozrite si to v akcii
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Vyskúšajte náš AI Sandbox na opravu kódu a sledujte kúzlo
            v reálnom čase.
          </p>
          <a
            href="/livecodeonline"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary rounded-lg font-bold text-lg hover:bg-white transition-all transform hover:scale-105"
          >
            Spustiť AI Sandbox
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Process;
