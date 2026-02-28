const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const REPO_BASE = path.join(__dirname, '..', 'repo');

const repoManager = {
    async extractZip(jobId, buffer) {
        const jobPath = path.join(REPO_BASE, String(jobId));
        if (!fs.existsSync(jobPath)) {
            fs.mkdirSync(jobPath, { recursive: true });
        }

        const zip = new JSZip();
        const contents = await zip.loadAsync(buffer);

        for (const [relativePath, file] of Object.entries(contents.files)) {
            const fullPath = path.join(jobPath, relativePath);
            if (file.dir) {
                fs.mkdirSync(fullPath, { recursive: true });
            } else {
                const data = await file.async('nodebuffer');
                fs.mkdirSync(path.dirname(fullPath), { recursive: true });
                fs.writeFileSync(fullPath, data);
            }
        }
        return jobPath;
    },

    async loadRepoFiles(jobId) {
        const jobPath = path.join(REPO_BASE, String(jobId));
        if (!fs.existsSync(jobPath)) return [];

        const files = [];
        const walk = (dir) => {
            const list = fs.readdirSync(dir);
            list.forEach((file) => {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat && stat.isDirectory()) {
                    walk(fullPath);
                } else {
                    const relativePath = path.relative(jobPath, fullPath);
                    const content = fs.readFileSync(fullPath, 'utf8');
                    files.push({ path: relativePath, content });
                }
            });
        };
        walk(jobPath);
        return files;
    },

    async saveFixedZip(jobId, buffer) {
        const jobPath = path.join(REPO_BASE, String(jobId));
        const zipPath = path.join(jobPath, 'fixed.zip');
        fs.writeFileSync(zipPath, buffer);
        return zipPath;
    }
};

module.exports = repoManager;
