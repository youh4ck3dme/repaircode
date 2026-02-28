# RepairCode - Production AI Patching Engine

RepairCode is a professional-grade AI patching engine designed for deep codebase audits and automated repairs. Transform your repository from "bug-prone" to "production-ready" with a single click.

## 🚀 Key Improvements (Hybrid Architecture)

Previously a stateless demo, RepairCode has been upgraded to a **Production Hybrid Architecture**:

- **Perzistentný Backend (Node.js + SQLite):** Všetky auditové úlohy sú teraz trvalé. Sledujte stav úloh (`pending`, `running`, `done`, `failed`) naprieč reštartami.
- **Hybridný Stack:** Frontend beží na **Next.js (App Router)** pre rýchle UI, zatiaľ čo náročná AI analýza a ZIP handling prebiehajú na dedikovanom **Node.js serveri**.
- **Gemini 2.0 Flash Integration:** Využíva najnovší model pre precízny, štruktúrovaný JSON výstup.
- **Stable Patching Engine:** Pokročilý "AST-aware" prompting zaručuje, že opravy sú minimálne, bezpečné a zachovávajú kódový štýl.
- **Dockerized Persistence:** Automaticky nakonfigurované Docker zväzky (volumes) pre perzistenciu databázy a repozitárov.

## 🛠️ Tech Stack

- **Frontend**: React 18, Next.js (App Router), Tailwind CSS, Framer Motion
- **Backend**: Node.js (ESM), Express, SQLite3
- **AI**: Gemini 2.0 Flash (Google Generative AI)
- **File Handling**: JSZip, adm-zip
- **Testing**: Vitest, React Testing Library
- **DevOps**: Docker, Docker Compose, Husky, lint-staged

## 📦 Inštalácia & Spustenie

1. **Klonovanie a závislosti:**
   ```bash
   npm install
   ```

2. **Environmentálne premenné:**
   Vytvorte súbor `.env` v koreňovom adresári a v `/server` (alebo použite globálny `.env`):
   ```env
   GEMINI_API_KEY=your_key_here
   PORT=4000
   ```

3. **Spustenie (Development):**
   ```bash
   npm run dev      # Frontend (Vite/Next)
   npm run server   # Backend (Node)
   ```

4. **Spustenie (Docker - Production):**
   ```bash
   docker-compose up --build
   ```

## 🤖 AI Workflow (LiveCodeOnline)

Navštívte sekciu **LiveCodeOnline** pre kompletný flow:
1. **Nahrať (Upload):** Vložte ZIP archív vášho projektu.
2. **Analyzovať (Audit):** AI vykoná hĺbkovú diagnostiku a navrhne opravy.
3. **Opraviť (Patch):** Jedným kliknutím aplikujte fixy.
4. **Stiahnuť (Export):** Získajte opravený projekt ako hotový ZIP.

## 📄 License

MIT
