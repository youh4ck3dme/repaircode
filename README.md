# RepairCode - Premium Code Repair with AI Box

RepairCode is a cutting-edge web application designed to demonstrate the future of automated code repair. It features a premium, dark-themed UI, smooth Framer Motion animations, and a fully interactive "AI Sandbox" where users can upload codebases for simulated AI analysis and repair.

## 🚀 Features

- **Multi-Page Architecture**: 7 distinct pages (Home, Services, Process, About, Contact, Audit, LiveCodeOnline).
- **AI Code Sandbox**:
  - Drag & drop .zip file support.
  - Real-time file tree explorer.
  - Syntax-highlighted code viewer.
  - **Multi-Agent Simulation**: Visualizes Analyzer, Factory, and Polisher agents working in real-time.
- **Premium Design**:
  - Tailwind CSS styling with a custom dark theme.
  - Glassmorphism effects and animated gradients.
  - Matrix-style code rain background.
  - Interactive particle effects.
- **AI Code Sandbox**:
  - Drag & drop .zip file support with real-time extraction progress.
  - Interactive "File Health Dashboard" with color-coded analysis (Green/Orange/Red).
  - Real-time file tree explorer and syntax-highlighted code viewer.
  - **5-Stage AI Simulation**: Visualizes a full pipeline: Diagnostics -> Security (SCA) -> Performance -> Architecture -> Repair Plan.
  - **PR Template Generation**: Automated creation of Pull Request templates for security vulnerabilities.
  - Live statistics dashboard tracking files, issues, and fixes.
- **Testing & CI/CD**:
  - Full unit test suite using **Vitest** and **React Testing Library**.
  - **Dockerized Architecture**: Ready-to-use Dockerfiles for frontend (Nginx) and backend (Node).
  - **GitHub Actions**: Automated CI pipeline for linting, testing, and building.
- **Performance**:
  - Lazy loading for all page components.
  - Optimized animations using Framer Motion.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS
- **Backend (Stub)**: Node.js, Express, Axios
- **Code Analysis**: PrismJS, react-syntax-highlighter
- **Testing**: Vitest, Supertest, Testing Library
- **DevOps**: Docker, Docker Compose, GitHub Actions
- **Animations & Icons**: Framer Motion, Lucide React

## 📦 Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start the full stack (requires two terminals or background):
   ```bash
   npm run dev      # Start Vite Frontend
   npm run server   # Start Node Backend
   ```

4. Run Tests:
   ```bash
   npm run test
   ```

## 🤖 AI Simulation

Check out the `/livecodeonline` page to see the **5-Stage AI Sandbox** in action. Upload a .zip file to watch the specialized agents perform deep codebase diagnostics, security scans (SCA), performance profiling, and generate a final prioritized **Repair Plan** with PR templates.

## 📄 License

MIT
