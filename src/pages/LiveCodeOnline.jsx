import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { motion } from "framer-motion";
import { Upload, FileCode, Terminal, Play, RefreshCw } from "lucide-react";

import FileTree from "../components/CodeSandbox/FileTree";
import CodeViewer from "../components/CodeSandbox/CodeViewer";
import AIAnalysisPanel from "../components/CodeSandbox/AIAnalysisPanel";
import ShimmerText from "../components/ShimmerText";
import ParticleBackground from "../components/ParticleBackground";
import PipelineVisualization from "../components/CodeSandbox/PipelineVisualization";
import AgentChatLog from "../components/CodeSandbox/AgentChatLog";
import StatsDashboard from "../components/CodeSandbox/StatsDashboard";

const LiveCodeOnline = () => {
  const [files, setFiles] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  // Simulation State
  const [simulationStage, setSimulationStage] = useState("idle"); // idle, analyzer, factory, polisher, completed
  const [agentLogs, setAgentLogs] = useState([]);
  const [stats, setStats] = useState({
    filesProcessed: 0,
    issuesFound: 0,
    issuesFixed: 0,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [issues, setIssues] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [fileFilter, setFileFilter] = useState("all");

  const addLog = (agent, message) => {
    setAgentLogs((prev) => [...prev, { id: Date.now(), agent, message }]);
  };

  const runSimulation = useCallback(async () => {
    setSimulationStage("analyzer");
    setIsAnalyzing(true);
    setAgentLogs([]);
    setIssues([]);

    // Stage 1: Analyzer
    addLog("Analyzer", "Initializing codebase scan...");
    await new Promise((r) => setTimeout(r, 1000));
    addLog("Analyzer", `Detected ${files.length} files in separate modules.`);
    await new Promise((r) => setTimeout(r, 800));
    addLog("Analyzer", "Identified architecture: React + Tailwind Monolith");
    await new Promise((r) => setTimeout(r, 800));

    const mockIssues = [
      {
        severity: "critical",
        title: "Security: Unsanitized Input",
        description: "Potential XSS vulnerability in UserProfile.jsx",
        file: "src/components/UserProfile.jsx",
        line: 45,
        suggestion: "Wrap output with DOMPurify.sanitize()",
      },
      {
        severity: "warning",
        title: "Performance: Large Bundle",
        description: "Heavy library 'moment.js' detected",
        file: "package.json",
        line: 12,
        suggestion: "Replace with 'date-fns' for 70% size reduction",
      },
      {
        severity: "info",
        title: "Code Style: Legacy Patterns",
        description: "Found 'var' usage in utils.js",
        file: "src/utils.js",
        line: 8,
        suggestion: "Migrate to const/let",
      },
    ];
    setIssues(mockIssues);
    setStats((prev) => ({ ...prev, issuesFound: mockIssues.length }));
    addLog(
      "Analyzer",
      `Scan complete. Found ${mockIssues.length} issues needing attention.`
    );

    // Stage 2: Factory
    setSimulationStage("factory");
    await new Promise((r) => setTimeout(r, 1000));
    addLog("Factory", "Starting optimization batch 1/1...");
    await new Promise((r) => setTimeout(r, 800));
    addLog("Factory", "Refactoring UserProfile.jsx - Applied security patches");
    await new Promise((r) => setTimeout(r, 800));
    addLog("Factory", "Optimizing dependencies in package.json");
    await new Promise((r) => setTimeout(r, 500));
    setStats((prev) => ({ ...prev, issuesFixed: 2 }));

    // Stage 3: Polisher
    setSimulationStage("polisher");
    await new Promise((r) => setTimeout(r, 1000));
    addLog("Polisher", "Formatting code with Prettier...");
    await new Promise((r) => setTimeout(r, 800));
    addLog("Polisher", "Generating JSDoc documentation for new functions");
    await new Promise((r) => setTimeout(r, 800));
    addLog("Polisher", "Final validation check passed.");

    setSimulationStage("completed");
    setIsAnalyzing(false);
    setStats((prev) => ({
      ...prev,
      issuesFixed: 3,
      filesProcessed: files.length,
    }));
  }, [files.length]);

  const onSelectFile = (file) => {
    // If it's a folder, toggle expansion is handled by FileTree internal or passed prop
    if (file.type === "folder") return;

    setSelectedFile(file);
    if (!file.content) {
      setFileContent("// Binary file or empty");
    } else {
      setFileContent(file.content);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const zip = new JSZip();
          const contents = await zip.loadAsync(e.target.result);

          const filesArray = [];

          let count = 0;
          for (const [path, zipEntry] of Object.entries(contents.files)) {
            if (count > 50) break; // Limit for demo

            // Only process if it's not a directory entry itself (though we need dirs for structure)
            // Actually JSZip entries for files have full paths.

            const fileName = path.split("/").pop();
            const type = zipEntry.dir
              ? "folder"
              : fileName.includes(".")
              ? fileName.split(".").pop()
              : "file";

            let content = "";
            if (!zipEntry.dir) {
              try {
                // Only try parsing text files
                if (
                  [
                    "js",
                    "jsx",
                    "ts",
                    "tsx",
                    "css",
                    "html",
                    "json",
                    "md",
                    "txt",
                    "gitignore",
                    "env",
                  ].includes(type)
                ) {
                  content = await zipEntry.async("string");
                } else {
                  content = "// Binary or unsupported file type";
                }
              } catch {
                content = "// Error reading file";
              }
              count++;
            }

            filesArray.push({
              name: fileName,
              path: path,
              type: type,
              content: content,
            });
          }

          setFiles(filesArray);

          // Select first file
          const firstFile = filesArray.find((f) => f.type !== "folder");
          if (firstFile) {
            onSelectFile(firstFile);
          }
        } catch (error) {
          console.error("Error reading zip", error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
    multiple: false,
  });

  // Reconstruct tree helper
  const buildTree = (filesList) => {
    const tree = [];
    filesList.forEach((file) => {
      if (!file.name) return; // skip root or empty

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
          // Determine type from file list if it matches
          // But folder entries might not be explicitly in filesList if zip didn't have explicit dir entries
          // So we imply folders
          const isFolder = !isLast || file.type === "folder";

          const newNode = {
            id: file.path, // This might be wrong for intermediate folders, need partial path
            name: part,
            type: isFolder ? "folder" : file.type,
            children: [],
            content: isLast ? file.content : null,
          };

          // Fix ID for intermediate folders
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

  const fileTreeData = buildTree(files);

  const handleSelectNode = (node) => {
    if (node.type === "folder") {
      setExpandedFolders((prev) => ({ ...prev, [node.id]: !prev[node.id] }));
    } else {
      setSelectedFile(node);
      setFileContent(node.content || "");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
          <Terminal className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent font-semibold">
            Multi-Agent System Active
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Live Code <ShimmerText>Sandbox</ShimmerText>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Upload your .zip codebase and watch our AI Agents analyze, repair, and
          polish it in real-time.
        </p>
      </div>

      {files.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div
            {...getRootProps()}
            className={`relative overflow-hidden p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
              isDragActive
                ? "border-accent bg-accent/10 scale-105"
                : "border-white/20 bg-surface/50 hover:border-accent/50 hover:bg-surface/80"
            }`}
          >
            <ParticleBackground />
            <input {...getInputProps()} />
            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {isDragActive ? "Drop your .zip file here" : "Upload Codebase"}
              </h3>
              <p className="text-gray-400 mb-4">
                Drag & drop your .zip file or click to browse
              </p>
              <p className="text-sm text-gray-600">
                Supports: .zip files up to 50MB
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
          {/* Left Panel: File Tree */}
          <div className="lg:col-span-3 bg-surface/50 rounded-xl border border-white/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-accent" />
                Explorer
              </h3>
              <span className="text-xs text-gray-500">
                {files.length} files
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <FileTree
                data={fileTreeData}
                onSelect={handleSelectNode}
                selectedFile={selectedFile ? selectedFile.id : null}
                expandedFolders={expandedFolders}
                onToggleFolder={(id) =>
                  setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }))
                }
              />
            </div>
          </div>

          {/* Middle Panel: Code Viewer */}
          <div className="lg:col-span-6 bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
            <div className="p-3 border-b border-white/10 flex justify-between items-center bg-[#2d2d2d]">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300 font-mono">
                  {selectedFile ? selectedFile.name : "No file selected"}
                </span>
              </div>
              {selectedFile && (
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Read-Only
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden relative">
              <CodeViewer
                code={fileContent}
                language={selectedFile?.type || "javascript"}
                showLineNumbers={true}
              />
            </div>
          </div>

          {/* Right Panel: AI Agents & Analysis */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Control Panel */}
            <div className="bg-surface/50 rounded-xl border border-white/10 p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent" />
                Agent Control
              </h3>

              {simulationStage === "idle" || simulationStage === "completed" ? (
                <button
                  onClick={runSimulation}
                  className="w-full py-3 bg-accent text-primary rounded-lg font-bold hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
                >
                  {simulationStage === "completed" ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Rerun Analysis
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Start AI Agents
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full py-3 bg-gray-700/50 text-gray-400 rounded-lg font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-white/5">
                  <div className="w-4 h-4 border-2 border-accent/50 border-t-accent rounded-full animate-spin" />
                  Processing...
                </div>
              )}
            </div>

            {/* Pipeline Visualization */}
            {simulationStage !== "idle" && (
              <>
                <StatsDashboard stats={stats} show={true} />
                <PipelineVisualization currentStage={simulationStage} />
              </>
            )}

            {/* Agent Chat Log */}
            <div className="flex-1 min-h-[200px]">
              <AgentChatLog logs={agentLogs} />
            </div>

            {/* Issues / Analysis Panel - showing results when populated */}
            {issues.length > 0 && (
              <div className="flex-1 bg-surface/50 rounded-xl border border-white/10 overflow-hidden flex flex-col min-h-[200px]">
                <AIAnalysisPanel
                  issues={issues}
                  isAnalyzing={isAnalyzing}
                  onApplyFix={() => {}}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCodeOnline;
