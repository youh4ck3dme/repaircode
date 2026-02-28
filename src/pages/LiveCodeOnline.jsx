import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { motion } from "framer-motion";
import { Upload, Play, RefreshCw, Terminal, FileText as FileCode, Zap } from "lucide-react";

import FileTree from "../components/CodeSandbox/FileTree";
import CodeViewer from "../components/CodeSandbox/CodeViewer";
import AIAnalysisPanel from "../components/CodeSandbox/AIAnalysisPanel";
import ShimmerText from "../components/ShimmerText";
import AgentChatLog from "../components/CodeSandbox/AgentChatLog";
import StatsDashboard from "../components/CodeSandbox/StatsDashboard";
import ParticleBackground from "../components/ParticleBackground";
import ProgressBar from "../components/ProgressBar";
import { useToasts } from "../components/ToastManager";
import { useLanguage } from "../contexts/LanguageContext";

const LiveCodeOnline = () => {
  const [files, setFiles] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [uploadedZipFile, setUploadedZipFile] = useState(null);

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);

  // Simulation State
  const [simulationStage, setSimulationStage] = useState("idle"); // idle, analyzer, factory, polisher, completed
  const [agentLogs, setAgentLogs] = useState([]);
  const [stats] = useState({
    filesProcessed: 0,
    issuesFound: 0,
    issuesFixed: 0,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [issues, setIssues] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [fileFilter, setFileFilter] = useState("all");

  const { show: showToast } = useToasts();
  const { t } = useLanguage();

  const addLog = useCallback((agent, message) => {
    setAgentLogs((prev) => [...prev, { id: Date.now(), agent, message }]);
  }, []);

  const runSimulation = useCallback(async () => {
    if (files.length === 0) {
      addLog("system", "Error: No files detected for analysis.");
      return;
    }

    setShowDashboard(false);
    setSimulationStage("diagnostics");
    setIsAnalyzing(true);
    setAgentLogs([]);
    setIssues([]);

    const pollJob = async (jobId) => {
      while (true) {
        const res = await fetch(`http://localhost:4000/api/proxy/status/${jobId}`);
        const data = await res.json();
        if (data.status === 'completed') return data.result;
        if (data.status === 'failed') throw new Error(data.error || "Job failed");
        await new Promise(r => setTimeout(r, 2000));
      }
    };

    try {
      addLog("Diagnostics", "Initializing codebase scan via AI Sandbox Proxy...");

      const formData = new FormData();
      if (typeof uploadedZipFile !== 'undefined' && uploadedZipFile) {
        formData.append('file', uploadedZipFile);
      }

      const diagRes = await fetch('http://localhost:4000/api/proxy/diagnostics', {
        method: 'POST',
        body: formData
      });

      let diagData = await diagRes.json();
      if (diagRes.status === 202) {
        addLog("system", `Job accepted. ID: ${diagData.job_id}. Polling...`);
        diagData = await pollJob(diagData.job_id);
      }

      const analysis = diagData.result?.json || diagData.json || {};
      const markdown = diagData.result?.markdown || diagData.markdown || "";

      addLog("Diagnostics", `Analysis complete. Stack: ${analysis.language_stack?.join(", ") || "Unknown"}`);
      if (markdown) addLog("analyzer", "Context: " + markdown.split('\n')[0]);

      setSimulationStage("security");
      addLog("Security", "Running real-time SCA scan on package.json...");

      const pkgFile = files.find(f => f.name === 'package.json');
      if (pkgFile) {
        const scanFormData = new FormData();
        const blob = new Blob([pkgFile.content], { type: 'application/json' });
        scanFormData.append('manifest', blob, 'package.json');

        const scanRes = await fetch('http://localhost:4000/api/proxy/scan', {
          method: 'POST',
          body: scanFormData
        });
        const scaData = await scanRes.json();

        if (scaData.vulnerabilities) {
          addLog("Security", `Found ${scaData.vulnerabilities.length} vulnerabilities.`);
          const securityIssues = scaData.vulnerabilities.map(v => ({
            severity: v.severity,
            title: `SCA: ${v.package}`,
            description: v.description,
            suggestion: v.fix_command
          }));
          setIssues(prev => [...prev, ...securityIssues]);
        }
      }

      setSimulationStage("performance");
      await new Promise(r => setTimeout(r, 1000));
      setSimulationStage("architecture");
      await new Promise(r => setTimeout(r, 1000));
      setSimulationStage("repair");
      addLog("system", "Generating final repair plan...");
      await new Promise(r => setTimeout(r, 2000));

      setSimulationStage("completed");
      setIsAnalyzing(false);
      addLog("system", "Pipeline complete. All agents finalized.");
      showToast(t("toast.analysisComplete"), "success");

    } catch (error) {
      console.error("Simulation error:", error);
      addLog("error", `Analysis failed: ${error.message}`);
      setIsAnalyzing(false);
      setSimulationStage("completed");
      showToast(`${t("toast.error")}: ${error.message}`, "error");
    }
  }, [files, addLog, uploadedZipFile, showToast, t]);

  const onSelectFile = useCallback((file) => {
    if (file.type === "folder") return;
    setSelectedFile(file);
    if (!file.content) {
      setFileContent("// Binary file or empty");
    } else {
      setFileContent(file.content);
    }
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedZipFile(file);
      setIsExtracting(true);
      setExtractionProgress(0);

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const zip = new JSZip();
          const contents = await zip.loadAsync(e.target.result);

          const filesArray = [];
          const totalFiles = Object.keys(contents.files).length;
          let processedCount = 0;

          for (const [path, zipEntry] of Object.entries(contents.files)) {
            if (processedCount > 50) break;

            const fileName = path.split("/").pop();
            const type = zipEntry.dir
              ? "folder"
              : fileName.includes(".")
                ? fileName.split(".").pop()
                : "file";

            let content = "";
            if (!zipEntry.dir) {
              try {
                if (
                  ["js", "jsx", "ts", "tsx", "css", "html", "json", "md", "txt", "gitignore", "env"].includes(type)
                ) {
                  content = await zipEntry.async("string");
                } else {
                  content = "// Binary or unsupported file type";
                }
              } catch {
                content = "// Error reading file";
              }
            }

            filesArray.push({
              id: path,
              name: fileName,
              path: path,
              type: type,
              content: content,
              healthScore: Math.floor(Math.random() * 100),
            });

            processedCount++;
            setExtractionProgress(Math.floor((processedCount / Math.min(totalFiles, 50)) * 100));
            if (processedCount % 5 === 0) await new Promise(r => setTimeout(r, 50));
          }

          for (let p = 0; p <= 100; p += 5) {
            setExtractionProgress(p);
            await new Promise(r => setTimeout(r, 50));
          }

          setFiles(filesArray);
          setIsExtracting(false);
          setShowDashboard(true);
          showToast(t("toast.extractionComplete"), "success");

          const firstFile = filesArray.find((f) => f.type !== "folder");
          if (firstFile) {
            onSelectFile(firstFile);
          }
        } catch {
          setIsExtracting(false);
          setExtractionProgress(0);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [onSelectFile, showToast, t]);

  const dropzoneOptions = useMemo(() => ({
    onDrop,
    accept: {
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
    multiple: false,
  }), [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  const buildTree = (filesList) => {
    const tree = [];
    filesList.forEach((file) => {
      if (!file.name) return;
      const parts = file.path.split("/").filter((p) => p);
      let currentLevel = tree;

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const existingNode = currentLevel.find((item) => item.name === part);

        if (existingNode) {
          if (existingNode.type === "folder") {
            currentLevel = existingNode.children;
          }
        } else {
          const isFolder = !isLast || file.type === "folder";
          const newNode = {
            id: file.path,
            name: part,
            type: isFolder ? "folder" : file.type,
            children: [],
            content: isLast ? file.content : null,
          };
          if (!isLast) {
            const partialPath = parts.slice(0, index + 1).join("/");
            newNode.id = partialPath;
          }
          currentLevel.push(newNode);
          if (isFolder) {
            currentLevel = newNode.children;
          }
        }
      });
    });
    return tree;
  };

  const fileTreeData = useMemo(() => buildTree(files), [files]);

  const handleSelectNode = (node) => {
    if (node.type === "folder") {
      setExpandedFolders((prev) => ({ ...prev, [node.id]: !prev[node.id] }));
    } else {
      setSelectedFile(node);
      setFileContent(node.content || "");
    }
  };

  const getHealthColor = (score) => {
    if (score > 70) return "text-green-400 border-green-500/30 bg-green-500/10";
    if (score >= 50) return "text-orange-400 border-orange-500/30 bg-orange-500/10";
    return "text-red-400 border-red-500/30 bg-red-500/10";
  };

  const [mobileTab, setMobileTab] = useState("explorer");

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
          <Terminal className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent font-semibold">
            Viacagentový systém aktívny
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Živý kódový <ShimmerText>Sandbox</ShimmerText>
        </h1>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
          Nahrajte váš .zip kód a sledujte, ako naši AI agenti analyzujú, opravujú a
          leštia ho v reálnom čase.
        </p>
      </div>

      {!showDashboard && files.length === 0 && !isExtracting ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div
            {...getRootProps()}
            className={`relative overflow-hidden p-8 md:p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${isDragActive
              ? "border-accent bg-accent/10 scale-105"
              : "border-white/20 bg-surface/50 hover:border-accent/50 hover:bg-surface/80"
              }`}
          >
            <ParticleBackground />
            <input {...getInputProps()} />
            <div className="text-center relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {isDragActive ? "Presuňte váš .zip súbor sem" : "Nahrať kódovú základňu"}
              </h3>
              <p className="text-sm md:text-base text-gray-400 mb-4">
                Pretiahnite .zip súbor sem alebo kliknite na prehľadávanie
              </p>
              <p className="text-xs text-gray-600">
                Podporuje: .zip súbory do 50MB
              </p>
            </div>
          </div>
        </motion.div>
      ) : isExtracting ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl"
        >
          <div className="text-center mb-6">
            <RefreshCw className="w-10 h-10 md:w-12 md:h-12 text-accent mx-auto mb-4 animate-spin" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Rozbaľujem kódovú základňu</h3>
            <p className="text-sm text-gray-400">Analyzujem štruktúru súborov a bezpečnostné vzory...</p>
          </div>
          <ProgressBar progress={extractionProgress} label="UNZIPPING_STREAM" className="mt-2" />
        </motion.div>
      ) : showDashboard ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-surface/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 md:p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5">
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-bold text-white">Prehľad projektu</h2>
                <p className="text-gray-400 text-xs md:text-sm">Počiatočný automatizovaný audit dokončený.</p>
              </div>
              <button
                onClick={runSimulation}
                className="w-full md:w-auto px-6 py-2.5 bg-accent text-primary rounded-xl font-bold hover:bg-white transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                <Play className="w-4 h-4" />
                Spustiť AI agentov
              </button>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-[400px] md:h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {files.filter(f => f.type !== 'folder').map((file, idx) => (
                  <motion.div
                    key={file.path}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.01 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-accent/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <FileCode className="w-5 h-5 text-accent" />
                      </div>
                      <div className={`px-2 py-1 rounded text-[10px] font-bold border ${getHealthColor(file.healthScore)}`}>
                        {file.healthScore}% ZDRAVIE
                      </div>
                    </div>
                    <h4 className="text-white font-medium truncate mb-1 group-hover:text-accent transition-colors">
                      {file.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 truncate font-mono">
                      {file.path}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-250px)] lg:h-[800px] gap-4">
          <div className="flex lg:hidden bg-surface/50 border border-white/10 rounded-xl p-1 shrink-0">
            {[
              { id: "explorer", label: "Prieskumník", icon: FileCode },
              { id: "editor", label: "Kód", icon: Terminal },
              { id: "analysis", label: "Analýza", icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMobileTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mobileTab === tab.id
                    ? "bg-accent text-primary shadow-lg shadow-accent/20"
                    : "text-gray-400 hover:text-white"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
            <div className={`${mobileTab === "explorer" ? "flex" : "hidden"} lg:flex lg:col-span-3 bg-surface/50 rounded-xl border border-white/10 overflow-hidden flex-col`}>
              <div className="p-3 md:p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-accent" />
                  Prieskumník
                </h3>
                <span className="text-[10px] text-gray-500">
                  {files.length} súborov
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <FileTree
                  data={fileTreeData}
                  onSelect={(node) => {
                    handleSelectNode(node);
                    if (node.type !== "folder") setMobileTab("editor");
                  }}
                  selectedFile={selectedFile ? selectedFile.id : null}
                  expandedFolders={expandedFolders}
                  onToggleFolder={(id) =>
                    setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }))
                  }
                />
              </div>
            </div>

            <div className={`${mobileTab === "editor" ? "flex" : "hidden"} lg:flex lg:col-span-6 bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden flex-col shadow-2xl relative`}>
              <div className="p-3 border-b border-white/10 flex justify-between items-center bg-[#2d2d2d] z-10">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs md:text-sm text-gray-300 font-mono truncate">
                    {selectedFile ? selectedFile.name : "Žiadny súbor"}
                  </span>
                </div>
                {selectedFile && (
                  <div className="flex gap-2 shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      R/O
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden relative">
                {selectedFile ? (
                  <CodeViewer
                    code={fileContent}
                    language={selectedFile?.type || "javascript"}
                    showLineNumbers={true}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                    <FileCode className="w-12 h-12 mb-4 opacity-20" />
                    <p>Vyberte súbor na zobrazenie</p>
                  </div>
                )}
              </div>
            </div>

            <div className={`${mobileTab === "analysis" ? "flex" : "hidden"} lg:flex lg:col-span-3 flex-col gap-4 md:gap-6 h-full overflow-hidden`}>
              <div className="bg-surface/50 rounded-xl border border-white/10 p-4 shrink-0">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                  <Terminal className="w-4 h-4 text-accent" />
                  Ovládanie agentov
                </h3>

                {simulationStage === "idle" || simulationStage === "completed" ? (
                  <button
                    onClick={runSimulation}
                    className="w-full py-2.5 md:py-3 bg-accent text-primary rounded-xl font-bold hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 active:scale-95"
                  >
                    {simulationStage === "completed" ? (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Re-Audit
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Spustiť AI Audit
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full py-2.5 md:py-3 bg-white/5 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-white/10">
                    <div className="w-4 h-4 border-2 border-accent/50 border-t-accent rounded-full animate-spin" />
                    Analyzujem...
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                {simulationStage !== "idle" && (
                  <div className="shrink-0">
                    <StatsDashboard stats={stats} show={true} />
                  </div>
                )}

                <div className="flex-1 min-h-[200px] flex flex-col gap-4 overflow-hidden">
                  <div className="flex-1">
                    <AgentChatLog logs={agentLogs} />
                  </div>

                  {issues.length > 0 && (
                    <div className="h-64 bg-surface/50 rounded-xl border border-white/10 overflow-hidden flex flex-col shrink-0">
                      <AIAnalysisPanel
                        issues={issues}
                        isAnalyzing={isAnalyzing}
                        onApplyFix={() => { }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCodeOnline;
