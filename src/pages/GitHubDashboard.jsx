import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Folder, GitBranch, Zap, Play, Search, AlertCircle, ChevronRight, Lock, ShieldCheck, Cpu, Key } from "lucide-react";
import { buildApiUrl } from "../config";
import { useToasts } from "../components/ToastManager";

const GitHubDashboard = () => {
    const [repos, setRepos] = useState(null);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [branches, setBranches] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [mode, setMode] = useState("bug_hunter"); // bug_hunter or architect
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [patInput, setPatInput] = useState("");
    const [patLoading, setPatLoading] = useState(false);
    const { show: showToast } = useToasts();

    useEffect(() => {
        fetchRepos();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch(buildApiUrl("/api/github/logout"), {
                method: "POST",
                credentials: "include",
            });
        } finally {
            setRepos(null);
            setSelectedRepo(null);
            setBranches(null);
            setError("not_authenticated");
        }
    };

    const fetchRepos = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(buildApiUrl("/api/github/repos"), { credentials: "include" });
            if (res.status === 401) {
                setError("not_authenticated");
                return;
            }
            const data = await res.json();
            setRepos(data.repos || []);
        } catch (err) {
            setError("Failed to fetch repositories. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePatConnect = async () => {
        if (!patInput.trim()) return;
        setPatLoading(true);
        try {
            const res = await fetch(buildApiUrl("/api/github/set-token"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ token: patInput.trim() }),
            });
            if (!res.ok) throw new Error("Invalid token");
            setPatInput("");
            await fetchRepos();
        } catch (err) {
            showToast("Invalid token or connection error", "error");
        } finally {
            setPatLoading(false);
        }
    };

    const fetchBranches = async (fullName) => {
        const [owner, repo] = fullName.split("/");
        try {
            const res = await fetch(buildApiUrl("/api/github/branches"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ owner, repo }),
            });
            const data = await res.json();
            setBranches(data.branches || []);
            if (data.branches?.length > 0) {
                // Set default branch if possible or first one
                const repoObj = repos.find(r => r.full_name === fullName);
                setSelectedBranch(repoObj?.default_branch || data.branches[0]);
            }
        } catch (err) {
            showToast("Failed to fetch branches", "error");
        }
    };

    const handleRunAudit = async () => {
        if (!selectedRepo || !selectedBranch) return;

        setLoading(true);
        const [owner, repo] = selectedRepo.split("/");

        try {
            const endpoint = mode === "architect" ? "/api/github/architect-audit" : "/api/github/audit";
            const res = await fetch(buildApiUrl(endpoint), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ owner, repo, branch: selectedBranch }),
            });

            const data = await res.json();
            if (data.success) {
                showToast("AI Audit started successfully!", "success");
                setTimeout(() => {
                    window.location.href = `/livecodeonline?jobId=${data.jobId}`;
                }, 1500);
            } else {
                throw new Error(data.error || "Failed to start audit");
            }
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredRepos = repos?.filter(repo =>
        repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-4"
                    >
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                            <Github className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">GitHub Dashboard</h1>
                            <p className="text-gray-400">Connect your repositories and audit them directly.</p>
                        </div>
                    </motion.div>
                </header>

                {error === "not_authenticated" ? (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-6 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl"
                    >
                        <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                            <Key className="w-5 h-5 text-primary" />
                            Connect GitHub Account
                        </h2>
                        <p className="text-gray-400 text-sm mb-5">
                            Sign in via OAuth or paste a Personal Access Token with <code className="text-primary bg-primary/10 px-1 rounded">repo</code> scope.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href={buildApiUrl("/api/github/login")}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-100 transition-all"
                            >
                                <Github className="w-4 h-4" />
                                Connect with GitHub
                            </a>
                            <div className="flex flex-1 gap-2">
                                <input
                                    type="password"
                                    placeholder="ghp_xxxx  Personal Access Token"
                                    value={patInput}
                                    onChange={(e) => setPatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handlePatConnect()}
                                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-200 placeholder:text-gray-600 focus:border-primary/50 outline-none transition-all"
                                />
                                <button
                                    onClick={handlePatConnect}
                                    disabled={patLoading || !patInput.trim()}
                                    className="px-5 py-2.5 bg-primary text-background rounded-xl font-bold text-sm disabled:opacity-50 hover:opacity-90 transition-all"
                                >
                                    {patLoading ? "..." : "Connect"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : error ? (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                ) : null}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Repo List */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        <div className="bg-surface/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Folder className="w-5 h-5 text-primary" />
                                    Your Repositories
                                </h2>
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                {repos && (
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-400 bg-white/5 border border-white/10 rounded-xl hover:text-red-400 hover:border-red-500/30 transition-all"
                                    >
                                        <Github className="w-3.5 h-3.5" />
                                        Logout
                                    </button>
                                )}
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search repos..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-200 focus:border-primary/50 transition-all outline-none"
                                    />
                                </div>
                                </div>
                            </div>

                            <div className="max-h-[600px] overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                {!repos && !loading ? (
                                    <div className="py-12 text-center text-gray-500">No repositories found.</div>
                                ) : loading && !repos ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <div key={i} className="h-16 bg-white/5 animate-pulse rounded-2xl" />
                                    ))
                                ) : (
                                    filteredRepos?.map((repo) => (
                                        <motion.button
                                            key={repo.id}
                                            onClick={() => {
                                                setSelectedRepo(repo.full_name);
                                                setBranches(null);
                                                fetchBranches(repo.full_name);
                                            }}
                                            whileHover={{ x: 4 }}
                                            className={`w-full group p-4 flex items-center justify-between rounded-2xl border transition-all ${selectedRepo === repo.full_name
                                                ? "bg-primary/10 border-primary/30"
                                                : "bg-white/5 border-white/5 hover:border-white/10"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4 text-left">
                                                <div className={`p-2 rounded-lg ${selectedRepo === repo.full_name ? "bg-primary/20 text-primary" : "bg-white/5 text-gray-400"}`}>
                                                    <Github className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-semibold">{repo.full_name}</span>
                                                        {repo.private && <Lock className="w-3 h-3 text-gray-500" />}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Default: {repo.default_branch}</div>
                                                </div>
                                            </div>
                                            <ChevronRight className={`w-5 h-5 transition-all ${selectedRepo === repo.full_name ? "text-primary opacity-100" : "text-gray-600 opacity-0 group-hover:opacity-100"}`} />
                                        </motion.button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Configuration Panel */}
                    <div className="lg:col-span-12 xl:col-span-5">
                        <AnimatePresence mode="wait">
                            {selectedRepo ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-surface/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl sticky top-24"
                                >
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 bg-primary/10 rounded-2xl">
                                            <Zap className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white tracking-tight">Audit Config</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Selected Repository</label>
                                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-sm">
                                                {selectedRepo}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Audit Mode</label>
                                            <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
                                                <button
                                                    onClick={() => setMode("bug_hunter")}
                                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === "bug_hunter" ? "bg-primary text-background shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                                                >
                                                    <ShieldCheck className="w-4 h-4" />
                                                    Bug Hunter
                                                </button>
                                                <button
                                                    onClick={() => setMode("architect")}
                                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === "architect" ? "bg-accent text-background shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                                                >
                                                    <Cpu className="w-4 h-4" />
                                                    Architect
                                                </button>
                                            </div>
                                            <p className="mt-2 text-[10px] text-gray-500 text-center uppercase tracking-tighter">
                                                {mode === "bug_hunter" ? "Target: Security & logic bugs" : "Target: Structure & refactoring"}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Branch</label>
                                            <div className="relative">
                                                <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                                <select
                                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white appearance-none focus:border-primary/50 transition-all outline-none"
                                                    value={selectedBranch}
                                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                                >
                                                    {!branches ? (
                                                        <option>Loading branches...</option>
                                                    ) : (
                                                        branches.map(b => <option key={b} value={b}>{b}</option>)
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                onClick={handleRunAudit}
                                                disabled={loading || !selectedBranch}
                                                className="w-full py-4 bg-primary text-background rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                                            >
                                                {loading ? (
                                                    <div className="w-6 h-6 border-4 border-background/30 border-t-background rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <Play className="w-6 h-6 fill-current" />
                                                        LAUNCH AI AUDIT
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <p className="text-xs text-gray-500 text-center leading-relaxed">
                                            RubberDuck will download the specific branch as a ZIP buffer,
                                            start the autonomous analysis pipeline, and notify you when ready.
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full min-h-[400px] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-white/[0.02]">
                                    <Github className="w-16 h-16 text-gray-700 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-600 mb-2">No Repository Selected</h3>
                                    <p className="text-gray-500 max-w-xs">
                                        Select a repository from your GitHub account to start an autonomous audit.
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GitHubDashboard;
