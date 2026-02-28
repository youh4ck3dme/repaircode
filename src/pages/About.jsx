import { motion } from "framer-motion";
import { Code2, Users, Target, Zap } from "lucide-react";
import ShimmerText from "../components/ShimmerText";

const About = () => {
  const values = [
    {
      icon: Code2,
      title: "Excelentnosť kódu",
      description:
        "Veríme v písanie čistého, udržiavateľného kódu, ktorý obstojí v skúške času.",
    },
    {
      icon: Users,
      title: "Partnerstvo s klientom",
      description:
        "Váš úspech je náš úspech. Pracujeme ako rozšírenie vášho tímu.",
    },
    {
      icon: Target,
      title: "Orientácia na výsledky",
      description:
        "Zameriavame sa na merateľné výsledky: vyšší výkon, menej chýb, spokojnejší vývojári.",
    },
    {
      icon: Zap,
      title: "Inovácia na prvom mieste",
      description:
        "Využívame špičkovú AI a automatizáciu na dodávanie rýchlejších a inteligentnejších riešení.",
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
              O <ShimmerText className="pink">RepairCode</ShimmerText>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Naším poslaním je eliminácia technického dlhu a pomoc vývojárskym
              tímom dodávať rýchlejšie.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-invert max-w-none"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Náš príbeh</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">
              RepairCode založil tím senior inžinierov, ktorí strávili roky bojom
              so zastaranými kódovými základňami vo Fortune 500 spoločnostiach. Videli
              sme talentovaných vývojárov strácať nespočetné hodiny ladením starého kódu
              namiesto tvorby nových funkcií.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">
              Vedeli sme, že musí existovať lepší spôsob. Kombináciou AI analýzy
              s odborným ľudským inžinierstvom sme vytvorili systematický prístup
              k modernizácii zastaraných systémov bez rizika tradičných prepisov.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Dnes sme pomohli viac ako 50 spoločnostiam transformovať ich
              kódové základne, eliminovať milióny riadkov technického dlhu a
              odomknúť produktivitu vývojárov.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Naše hodnoty</h2>
            <p className="text-gray-400 text-lg">
              Zásady, ktoré riadia všetko, čo robíme
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl bg-surface border border-white/5 text-center"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Rokov skúseností", value: "10+" },
              { label: "Dokončených projektov", value: "50+" },
              { label: "Modernizovaných riadkov", value: "1.2M+" },
              { label: "Spokojnosť klientov", value: "99%" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
