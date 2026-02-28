import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Cpu,
  Code2,
  TestTube,
  Cloud,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import ShimmerText from "../components/ShimmerText";
import { useLanguage } from "../contexts/LanguageContext";

const ServiceCard = ({ icon: Icon, title, description, features, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-8 rounded-2xl bg-surface border border-white/5 hover:border-accent/50 transition-all group"
  >
    <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
      <Icon className="w-8 h-8 text-accent" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed mb-6">{description}</p>
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2 text-gray-300">
          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const PricingCard = ({ plan, index, isPopular }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative p-8 rounded-2xl border transition-all flex flex-col ${
        isPopular
          ? "bg-surface border-accent/50 shadow-lg shadow-accent/10"
          : "bg-surface border-white/5 hover:border-accent/30"
      }`}
    >
      {isPopular && plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1.5 bg-accent text-primary text-xs font-bold rounded-full shadow-lg shadow-accent/30">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-4">{plan.name}</h3>
        <div className="flex items-end gap-1">
          <span className="text-4xl font-extrabold text-white">{plan.price}</span>
          {plan.period && (
            <span className="text-gray-400 mb-1 text-sm">{plan.period}</span>
          )}
        </div>
        <p className="text-gray-400 text-sm mt-3 leading-relaxed">{plan.description}</p>
      </div>

      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      <Link
        to="/audit"
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
          isPopular
            ? "bg-accent text-primary hover:bg-white shadow-lg shadow-accent/20"
            : "border border-white/20 text-white hover:bg-white/10"
        }`}
      >
        {index === 0
          ? t("services.pricing.ctaStarter")
          : index === 1
          ? t("services.pricing.ctaPro")
          : t("services.pricing.ctaEnterprise")}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
};

const Pricing = () => {
  const { t } = useLanguage();
  const plans = t("services.pricing.plans");

  if (!Array.isArray(plans)) return null;

  return (
    <div className="py-20 bg-primary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-accent font-semibold tracking-wide uppercase">
            Pricing
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            {t("services.pricing.heading")}{" "}
            <ShimmerText>{t("services.pricing.headingHighlight")}</ShimmerText>
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            {t("services.pricing.subheading")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {plans.map((plan, i) => (
            <PricingCard key={i} plan={plan} index={i} isPopular={i === 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      icon: ShieldCheck,
      title: "Zabezpečenie systému",
      description:
        "Chráňte svoju aplikáciu pred zraniteľnosťami a hrozbami pomocou komplexných bezpečnostných auditov.",
      features: [
        "Skenovanie a oprava zraniteľností závislostí",
        "Prevencia SQL injection a XSS",
        "Vylepšenie autentifikácie a autorizácie",
        "Implementácia bezpečnostných hlavičiek a CSP",
        "Penetračné testovanie a modelovanie hrozieb",
      ],
    },
    {
      icon: Cpu,
      title: "Optimalizácia výkonu",
      description:
        "Urobte svoju aplikáciu bleskovo rýchlou pomocou pokročilých optimalizačných techník.",
      features: [
        "Optimalizácia databázových dotazov a indexovanie",
        "Profilovanie kódu a identifikácia úzkych hrdiel",
        "Stratégie cachovania (Redis, CDN)",
        "Lazy loading a rozdeľovanie kódu",
        "Optimalizácia renderovania na strane servera",
      ],
    },
    {
      icon: Code2,
      title: "Modernizácia kódu",
      description:
        "Transformujte zastaraný kód do čistej, udržiavateľnej a typovo bezpečnej modernej architektúry.",
      features: [
        "Refaktoring spaghetti kódu do čistých vzorov",
        "Migrácia na TypeScript",
        "Aktualizácia moderných frameworkov (React, Vue, Angular)",
        "Redizajn a dokumentácia API",
        "Tvorba knižnice komponentov",
      ],
    },
    {
      icon: TestTube,
      title: "Testovanie a QA",
      description:
        "Zaistite spoľahlivosť pomocou komplexných testovacích stratégií a procesov zabezpečenia kvality.",
      features: [
        "Implementácia unit a integračných testov",
        "E2E testovanie s Playwright/Cypress",
        "Analýza pokrytia testami",
        "Nastavenie CI/CD pipeline",
        "Automatizované regresné testovanie",
      ],
    },
    {
      icon: Cloud,
      title: "DevOps a infraštruktúra",
      description:
        "Zefektívnite nasadzovanie a prevádzku pomocou moderných DevOps postupov a cloudovej infraštruktúry.",
      features: [
        "Docker kontajnerizácia",
        "Kubernetes orchestrácia",
        "CI/CD automatizácia (GitHub Actions, GitLab)",
        "Migrácia do cloudu (AWS, GCP, Azure)",
        "Nastavenie monitorovania a logovania",
      ],
    },
    {
      icon: TrendingDown,
      title: "Redukcia technického dlhu",
      description:
        "Systematicky eliminujte technický dlh a zlepšite udržiavateľnosť kódovej základne.",
      features: [
        "Identifikácia a odstraňovanie code smells",
        "Čistenie a aktualizácia závislostí",
        "Generovanie dokumentácie",
        "Refaktoring architektúry",
        "Plánovanie migrácie zastaraných systémov",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden bg-gradient-to-b from-primary to-background">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Naše <ShimmerText className="purple">služby</ShimmerText>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Komplexné služby opravy a modernizácie kódu na transformáciu
              zastaraných systémov na výkonné aplikácie.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <ServiceCard key={i} {...service} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <Pricing />

      {/* CTA Section */}
      <div className="py-20 bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ste pripravení modernizovať váš kód?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Získajte bezplatný diagnostický audit a zistite, ako môžeme pomôcť
            transformovať vašu aplikáciu.
          </p>
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary rounded-lg font-bold text-lg hover:bg-white transition-all transform hover:scale-105"
          >
            Získať bezplatný audit
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
