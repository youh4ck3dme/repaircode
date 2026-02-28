const express = require('express');
const router = express.Router();

// Mock response for Diagnostics
router.post('/diagnostics', (req, res) => {
    res.json({
        language_stack: ["nodejs", "react", "vite"],
        top_level_files: ["package.json", "vite.config.js", "src/"],
        five_key_files_to_review: ["package.json", "src/App.jsx", "src/pages/LiveCodeOnline.jsx"],
        quick_risks: [".env pattern detected"],
        recommended_next_steps: ["run SCA", "scan for secrets"]
    });
});

// Mock response for Scan (SCA)
router.post('/scan', (req, res) => {
    res.json({
        vulnerabilities: [
            {
                id: "1",
                package: "lodash",
                severity: "critical",
                description: "Prototype pollution vulnerability."
            }
        ],
        summary: { total_vulns: 1, critical_count: 1 }
    });
});

module.exports = router;
