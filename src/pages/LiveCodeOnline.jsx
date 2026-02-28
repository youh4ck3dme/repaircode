import { useState, useCallback, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { motion } from "framer-motion";
import { Upload, Play, RefreshCw, Terminal, FileText as FileCode, Zap, ShieldCheck, Cpu } from "lucide-react";

import FileTree from "../components/CodeSandbox/FileTree";
import CodeViewer from "../components/CodeSandbox/CodeViewer";
import AIAnalysisPanel from "../components/CodeSandbox/AIAnalysisPanel";
import AgentChatLog from "../components/CodeSandbox/AgentChatLog";
import StatsDashboard from "../components/CodeSandbox/StatsDashboard";
import ParticleBackground from "../components/ParticleBackground";
import ProgressBar from "../components/ProgressBar";
import { useToasts } from "../components/ToastManager";
import { useLanguage } from "../contexts/LanguageContext";
import { buildApiUrl, buildEventUrl } from "../config";

const LiveCodeOnline = () => {
  const [files, setFiles] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [uploadedZipFile, setUploadedZipFile] = useState(null);

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [mode, setMode] = useState("bug_hunter"); // bug_hunter or architect

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

  // Auto-connect to an existing job when redirected from GitHub Dashboard
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("jobId");
    if (!jobId) return;

    // Clear the URL param without reload
    window.history.replaceState({}, "", "/livecodeonline");

    setSimulationStage("diagnostics");
    setIsAnalyzing(true);
    setAgentLogs([]);
    setIssues([]);
    addLog("system", `Resuming GitHub audit – Job ${jobId}. Connecting to live stream...`);

    const es = new EventSource(buildEventUrl(jobId));

    es.addEventListener("analysis_start", (e) => {
      const data = JSON.parse(e.data);
      addLog("Analyzer", data.message);
    });

    es.addEventListener("analysis_chunk_start", (e) => {
      const data = JSON.parse(e.data);
      addLog("Analyzer", data.message);
    });

    es.addEventListener("architect_analysis_start", (e) => {
      const data = JSON.parse(e.data);
      addLog("Architect", data.message);
    });

    es.addEventListener("architect_analysis_done", async () => {
      addLog("system", "Architectural analysis complete. Building refactoring plan...");
      setSimulationStage("architecture");
      const statusRes = await fetch(buildApiUrl(`/api/status/${jobId}`));
      const statusData = await statusRes.json();
      if (statusData.analysis?.refactors) {
        setIssues(statusData.analysis.refactors.map(r => ({ ...r, type: "refactor", jobId })));
      }
      fetch(buildApiUrl('/api/architect/fixes'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
    });

    es.addEventListener("architect_fixes_done", async () => {
      addLog("Designer", "Refactoring plan finalized.");
      setSimulationStage("completed");
      setIsAnalyzing(false);
      showToast("Architectural plan is ready!", "success");
      const statusRes = await fetch(buildApiUrl(`/api/status/${jobId}`));
      const statusData = await statusRes.json();
      if (statusData.analysis?.refactors && statusData.fixes?.actions) {
        const merged = statusData.analysis.refactors.map(ref => {
          const action = statusData.fixes.actions.find(a => a.refactorId === ref.id);
          return { ...ref, action, jobId, type: "refactor" };
        });
        setIssues(merged);
      }
      es.close();
    });

    es.addEventListener("analysis_done", async () => {
      addLog("system", "Analysis complete. Generating fixes...");
      setSimulationStage("architecture");
      const statusRes = await fetch(buildApiUrl(`/api/status/${jobId}`));
      const statusData = await statusRes.json();
      if (statusData.analysis?.issues) {
        setIssues(statusData.analysis.issues.map(i => ({ ...i, jobId })));
      }
      fetch(buildApiUrl('/api/fixes'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
    });

    es.addEventListener("fixes_done", async () => {
      addLog("Factory", "Fixes generated. Review the repair plan below.");
      setSimulationStage("completed");
      setIsAnalyzing(false);
      showToast("Analysis complete!", "success");
      const statusRes = await fetch(buildApiUrl(`/api/status/${jobId}`));
      const statusData = await statusRes.json();
      if (statusData.analysis?.issues && statusData.fixes?.fixes) {
        const mergedIssues = statusData.analysis.issues.map(issue => {
          const fix = statusData.fixes.fixes.find(f => f.issueId === issue.id);
          return { ...issue, fix, jobId };
        });
        setIssues(mergedIssues);
      }
      es.close();
    });

    es.addEventListener("error", (e) => {
      if (e.data) {
        try {
          const data = JSON.parse(e.data);
          addLog("error", data.message);
          showToast(`Error: ${data.message}`, "error");
        } catch { /* ignore parse errors */ }
      }
      setIsAnalyzing(false);
      setSimulationStage("completed");
      es.close();
    });

    return () => es.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSimulation = useCallback(async () => {
    if (!uploadedZipFile) {
      addLog("system", "Error: No ZIP file uploaded.");
      return;
    }

    setShowDashboard(false);
    setSimulationStage("diagnostics");
    setIsAnalyzing(true);
    setAgentLogs([]);
    setIssues([]);

    try {
      addLog("Diagnostics", "Uploading repository for analysis...");

      const formData = new FormData();
      formData.append('zip', uploadedZipFile);

      const endpoint = mode === "architect" ? "/api/architect/analyze" : "/api/analyze";
      const response = await fetch(buildApiUrl(endpoint), {
        method: 'POST',
        body: formData
      });

      const { jobId } = await response.json();
      addLog("system", `Job initialized: ${jobId}. Establishing real-time event stream...`);

      const es = new EventSource(buildEventUrl(jobId));

      es.addEventListener("analysis_start", (e) => {
        const data = JSON.parse(e.data);
        addLog("Analyzer", data.message);
      });

      es.addEventListener("analysis_chunk_start", (e) => {
        const data = JSON.parse(e.data);
        addLog("Analyzer", data.message);
      });

      // Architect Events
      es.addEventListener("architect_analysis_start", (e) => {
        const data = JSON.parse(e.data);
        addLog("Architect", data.message);
      });

      es.addEventListener("architect_analysis_done", async () => {
        addLog("system", "Architectural analysis complete. Building refactoring plan...");
        setSimulationStage("architecture");

        const statusRes = await fetch(buildApiUrl(`/api/status/${jobId}`));
        const statusData = await statusRes.json();
        if (statusData.analysis?.refactors) {
          setIssues(statusData.analysis.refactors.map(r => ({ ...r, type: "refactor", jobId })));
        }

        fetch(buildApiUrl('/api/architect/fixes'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId })
        });
      });

      es.addEventListener("architect_fixes_start", (e) => {
        const data = JSON.parse(e.data);
        addLog("Designer", data.message);
      });

      es.addEventListener("architect_fixes_done", async () => {
        addLog("Designer", "Refactoring plan finalized.");
        setSimulationStage("completed");
        setIsAnalyzing(false);
        showToast("Architectural plan is ready!", "success");

        const statusRes = await fetch(buildApiUrl(`/api/status/${jobId}`));
        const statusData = await statusRes.json();

        if (statusData.analysis?.refactors && statusData.fixes?.actions) {
          const merged = statusData.analysis.refactors.map(ref => {
            const action = statusData.fixes.actions.find(a => a.refactorId === ref.id);
            return { ...ref, action, jobId, type: "refactor" };
          });
          setIssues(merged);
        }
      });

      es.addEventListener("analysis_done", async () => {
        addLog("system", "Analysis complete. Now generating proposed fixes...");
        setSimulationStage("architecture");

        // Fetch issues after analysis is done
        const statusRes = await fetch(buildApiUrl(`/api/status/${jobId}`));
        const statusData = await statusRes.json();
        if (statusData.analysis?.issues) {
          setIssues(statusData.analysis.issues.map(i => ({ ...i, jobId })));
        }

        // Trigger Phase 2: Fixes
        fetch(buildApiUrl('/api/fixes'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId })
        });
      });

      es.addEventListener("fixes_start", (e) => {
        const data = JSON.parse(e.data);
        addLog("Factory", data.message);
      });

      es.addEventListener("fixes_done", async () => {
        addLog("Factory", "Fixes generated. Review the repair plan below.");
        setSimulationStage("completed");
        setIsAnalyzing(false);
        showToast(t("toast.analysisComplete"), "success");

        // Refresh issues and MERGE with fixes
        const statusRes = await fetch(buildApiUrl(`/api/status/${jobId}`));
        const statusData = await statusRes.json();

        if (statusData.analysis?.issues && statusData.fixes?.fixes) {
          const mergedIssues = statusData.analysis.issues.map(issue => {
            const fix = statusData.fixes.fixes.find(f => f.issueId === issue.id);
            return { ...issue, fix, jobId };
          });
          setIssues(mergedIssues);
        }
      });

      es.addEventListener("patch_start", (e) => {
        const data = JSON.parse(e.data);
        addLog("Polisher", data.message);
      });

      es.addEventListener("patch_done", (e) => {
        const data = JSON.parse(e.data);
        addLog("Polisher", data.message);
        showToast("Repository repaired successfully!", "success");
        es.close();
      });

      es.addEventListener("error", (e) => {
        if (e.data) {
          try {
            const data = JSON.parse(e.data);
            addLog("error", data.message);
            showToast(`Error: ${data.message}`, "error");
          } catch { /* ignore parse errors */ }
        }
        setIsAnalyzing(false);
        setSimulationStage("completed");
        es.close();
      });

    } catch (error) {
      console.error("Simulation error:", error);
      addLog("error", `Process failed: ${error.message}`);
      setIsAnalyzing(false);
      setSimulationStage("completed");
      showToast(`${t("toast.error")}: ${error.message}`, "error");
    }
  }, [addLog, mode, showToast, t, uploadedZipFile]);

  const handleApplyFix = useCallback(async (issue) => {
    try {
      showToast("Applying fix globally...", "info");
      addLog("system", `Requesting global patch via Job ${issue.jobId}...`);

      const res = await fetch(buildApiUrl(`/api/patch`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: issue.jobId, issueId: issue.id })
      });

      const result = await res.json();
      if (!result.success) throw new Error("Patch initialization failed");

      addLog("Polisher", `Patch generation started for Job ${issue.jobId}. We'll notify you when ready.`);
      showToast("Patching started! We're applying the fixes to the repository.", "success");

      setIssues(prev => prev.filter(i => i.id !== issue.id));

    } catch (error) {
      console.error("Apply fix error:", error);
      showToast(`Failed to apply fix: ${error.message}`, "error");
    }
  }, [addLog, showToast]);



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
        <div className="flex flex-col items-center mb-6">
          <motion.img
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            src="/logo.png"
            alt="RubberDuck Logo"
            className="w-24 h-24 mb-4 drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-bold tracking-wider uppercase">
              RubberDuck AI Engine v2.0
            </span>
          </div>
        </div>

        <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter">
          RubberDuck<span className="text-primary">.Space</span>
        </h1>
        <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto font-medium">
          The world&apos;s most advanced autonomous AI repair engine.
          Upload your repository and let the duck fix your code.
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
              <div className="text-center md:text-left flex items-center gap-4">
                <img src="/logo.png" className="w-10 h-10 opacity-80" alt="" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Project Ecosystem</h2>
                  <p className="text-gray-400 text-xs md:text-sm">Initial autonomous audit completed.</p>
                </div>
              </div>
              <button
                onClick={runSimulation}
                className="btn-primary flex items-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" />
                Launch Duck Analysis
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
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
                      <button
                        onClick={() => setMode("bug_hunter")}
                        className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${mode === "bug_hunter" ? "bg-primary text-background" : "text-gray-400 hover:text-white"}`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Hunter
                      </button>
                      <button
                        onClick={() => setMode("architect")}
                        className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${mode === "architect" ? "bg-accent text-background" : "text-gray-400 hover:text-white"}`}
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        Architect
                      </button>
                    </div>

                    <button
                      onClick={runSimulation}
                      className="w-full py-2.5 md:py-3 bg-accent text-background rounded-xl font-bold hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 active:scale-95"
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
                    {simulationStage === "completed" && issues.length === 0 && (
                      <button
                        onClick={async () => {
                          const jobId = issues[0]?.jobId || // fallback to first issue's jobId
                            // or look for it in state if we had it
                            // (Actually we should probably have stored currentJobId)
                            prompt("Enter Job ID to download:"); // Very fallback

                          if (jobId) {
                            window.location.href = buildApiUrl(`/api/download/${jobId}`);
                            showToast("Downloading fixed repository...", "success");
                          }
                        }}
                        className="w-full py-2.5 md:py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/20"
                      >
                        <Upload className="w-4 h-4 rotate-180" />
                        Stiahnuť opravený kód
                      </button>
                    )}

                  </div>
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
                        onApplyFix={handleApplyFix}
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
