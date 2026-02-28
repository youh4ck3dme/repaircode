const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: '/tmp' });

// Status Polling - Checks the status of a specific job_id
router.get('/status/:jobId', async (req, res) => {
    try {
        const response = await fetch(`${process.env.SANDBOX_ENDPOINT}/api/status/${req.params.jobId}`, {
            headers: { 'Authorization': `Bearer ${process.env.SANDBOX_API_KEY}` }
        });
        const data = await response.json();
        res.json(data);
    } catch {
        res.status(500).json({ error: "Failed to fetch job status" });
    }
});

// Diagnostics Proxy - Handles ZIP Uploads with potential Job ID response
router.post('/diagnostics', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(req.file.path));
        form.append('prompt', req.body.prompt || "Analyze codebase");

        const response = await fetch(process.env.SANDBOX_ENDPOINT + '/api/diagnostics', {
            method: 'POST',
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${process.env.SANDBOX_API_KEY}`
            },
            body: form
        });

        const data = await response.json();

        // Clean up temp file
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        // If it's 202 Accepted, it will have a job_id
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy Diagnostics Error:", error);
        res.status(500).json({ error: "Failed to forward request to Sandbox API" });
    }
});

// SCA Scan Proxy - Handles manifest uploads (package.json, requirements.txt)
router.post('/scan', upload.single('manifest'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No manifest uploaded" });
        }

        const form = new FormData();
        form.append('manifest', fs.createReadStream(req.file.path));
        form.append('prompt', 'Scan dependency manifest. Return vulnerabilities array with id, package, installed_version, cve_or_reference, severity, description, fix_version, fix_command.');

        const response = await fetch(process.env.SANDBOX_ENDPOINT + '/api/scan', {
            method: 'POST',
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${process.env.SANDBOX_API_KEY}`
            },
            body: form
        });

        const data = await response.json();
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(response.status).json(data);
    } catch {
        res.status(500).json({ error: "Failed to forward scan request" });
    }
});

module.exports = router;
