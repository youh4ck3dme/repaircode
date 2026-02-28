import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import fetch from "node-fetch";

import { createJob, getJobStatus, getAnalysis, getFixes } from "./db/client.js";
import { saveZip, loadFixedZip } from "./repo/files.js";
import { runAnalysis } from "./orchestrators/analysis.js";
import { runAnalysisArchitect } from "./orchestrators/analysisArchitect.js";
import { runFixes } from "./orchestrators/fixes.js";
import { runFixesArchitect } from "./orchestrators/fixesArchitect.js";
import { runPatch } from "./orchestrators/patch.js";
import { addListener, removeListener } from "./events/progress.js";
import { getOAuthClient, listUserRepos, listBranches, downloadRepoZip, createBranchAndPr } from "./github/client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(fileUpload({
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'repaircode-api' });
});

app.get("/events/:jobId", (req, res) => {
  const { jobId } = req.params;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  addListener(jobId, res);
  req.on("close", () => removeListener(jobId, res));
});

// 1. Upload & Analyze
app.post('/api/analyze', async (req, res) => {
  try {
    const zip = req.files?.zip;
    if (!zip) return res.status(400).json({ error: "Missing ZIP file" });

    const jobId = await createJob();
    await saveZip(jobId, zip.data);

    // Start Analysis Async (Fire and Forget)
    runAnalysis(jobId).catch(error => console.error(`Job ${jobId} failed:`, error));

    res.json({ success: true, jobId });
  } catch (error) {
    console.error("Analyze Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 1b. Architect Analyze
app.post('/api/architect/analyze', async (req, res) => {
  try {
    const zip = req.files?.zip;
    if (!zip) return res.status(400).json({ error: "Missing ZIP file" });

    const jobId = await createJob();
    await saveZip(jobId, zip.data);

    // Start Architect Analysis
    runAnalysisArchitect(jobId).catch(error => console.error(`Architect Job ${jobId} failed:`, error));

    res.json({ success: true, jobId });
  } catch (error) {
    console.error("Architect Analyze Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Status Polling
app.get('/api/status/:jobId', async (req, res) => {
  try {
    const job = await getJobStatus(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const analysis = await getAnalysis(req.params.jobId);
    const fixes = await getFixes(req.params.jobId);
    res.json({ status: job.status, analysis, fixes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Fix Generation
app.post('/api/fixes', async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ error: "Missing jobId" });

    // Start Fixes Async
    runFixes(jobId).catch(error => console.error(`Fixes failed for ${jobId}:`, error));

    res.json({ success: true, message: "Fix generation started" });
  } catch (error) {
    console.error("Fixes Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3b. Architect Fixes
app.post('/api/architect/fixes', async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ error: "Missing jobId" });

    // Start Architect Fixes
    runFixesArchitect(jobId).catch(error => console.error(`Architect Fixes failed for ${jobId}:`, error));

    res.json({ success: true, message: "Architect refactoring plan generation started" });
  } catch (error) {
    console.error("Architect Fixes Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Patch Initialization
app.post('/api/patch', async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ error: "Missing jobId" });

    // Start Patching Async
    runPatch(jobId).catch(error => console.error(`Patch failed for ${jobId}:`, error));

    res.json({ success: true, message: "Patching started" });
  } catch (error) {
    console.error("Patch Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Download Final ZIP
app.get('/api/download/:jobId', async (req, res) => {
  try {
    const buffer = await loadFixedZip(req.params.jobId);
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="repaircode-fixed-${req.params.jobId}.zip"`);
    res.send(buffer);
  } catch {
    res.status(404).send("Fixed archive not found or not yet generated.");
  }
});

// --- GITHUB INTEGRATION ---

// GitHub Login Redirect
app.get('/api/github/login', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_OAUTH_REDIRECT_URI;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo read:user",
    allow_signup: "true"
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

// GitHub OAuth Callback
app.get('/api/github/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.redirect("/?error=missing_code");

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenJson = await tokenRes.json();
    const token = tokenJson.access_token;

    if (!token) return res.redirect("/?error=oauth_failed");

    // Store token in cookie
    res.cookie("gh_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.redirect("/github-dashboard");
  } catch (error) {
    console.error("GitHub Callback Error:", error);
    res.redirect("/?error=callback_failed");
  }
});

// Set GitHub token manually (Personal Access Token)
app.post('/api/github/set-token', (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string' || token.trim().length < 10) {
    return res.status(400).json({ error: "Invalid token" });
  }
  res.cookie("gh_token", token.trim(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
  res.json({ success: true });
});

// Logout from GitHub (clear token cookie)
app.post('/api/github/logout', (req, res) => {
  res.clearCookie("gh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax",
  });
  res.json({ success: true });
});

// List User Repos
app.get('/api/github/repos', async (req, res) => {
  try {
    const token = req.cookies.gh_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const client = getOAuthClient(token);
    const repos = await listUserRepos(client);
    res.json({ repos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List Branches
app.post('/api/github/branches', async (req, res) => {
  try {
    const token = req.cookies.gh_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { owner, repo } = req.body;
    const client = getOAuthClient(token);
    const branches = await listBranches(client, owner, repo);
    res.json({ branches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run Audit on GitHub Repo
app.post('/api/github/audit', async (req, res) => {
  try {
    const token = req.cookies.gh_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { owner, repo, branch } = req.body;
    const client = getOAuthClient(token);

    const jobId = await createJob();
    const zipBuffer = await downloadRepoZip(client, owner, repo, branch);
    await saveZip(jobId, zipBuffer);

    // Start Analysis Async
    runAnalysis(jobId).catch(error => console.error(`Job ${jobId} failed:`, error));

    res.json({ success: true, jobId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run Architect Audit on GitHub Repo
app.post('/api/github/architect-audit', async (req, res) => {
  try {
    const token = req.cookies.gh_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { owner, repo, branch } = req.body;
    const client = getOAuthClient(token);

    const jobId = await createJob();
    const zipBuffer = await downloadRepoZip(client, owner, repo, branch);
    await saveZip(jobId, zipBuffer);

    // Start Architect Analysis
    runAnalysisArchitect(jobId).catch(error => console.error(`Architect Job ${jobId} failed:`, error));

    res.json({ success: true, jobId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Pull Request
app.post('/api/github/create-pr', async (req, res) => {
  try {
    const token = req.cookies.gh_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { owner, repo, baseBranch, newBranch, title, body } = req.body;
    const client = getOAuthClient(token);

    const prUrl = await createBranchAndPr(client, {
      owner,
      repo,
      baseBranch,
      newBranch,
      title,
      body
    });

    res.json({ success: true, prUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Production Backend running on port ${PORT} (ESM Mode)`);
});

export default app;
