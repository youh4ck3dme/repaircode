import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from 'url';

import { createJob, getJobStatus, getAnalysis } from "./db/client.js";
import { saveZip, loadFixedZip } from "./repo/files.js";
import { runAnalysis } from "./orchestrators/analysis.js";
import { runFixes } from "./orchestrators/fixes.js";
import { runPatch } from "./orchestrators/patch.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(fileUpload({
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'repaircode-api' });
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

// 2. Status Polling
app.get('/api/status/:jobId', async (req, res) => {
  try {
    const job = await getJobStatus(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const analysis = await getAnalysis(req.params.jobId);
    res.json({ status: job.status, analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Patch Initialization
app.post('/api/patch', async (req, res) => {
  try {
    const { jobId, fixes } = req.body;
    if (!jobId || !fixes) return res.status(400).json({ error: "Missing jobId or fixes" });

    await runFixes(jobId, fixes);

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

app.listen(PORT, () => {
  console.log(`Production Backend running on port ${PORT} (ESM Mode)`);
});

export default app;
