import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
import JSZip from "jszip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.NODE_ENV === 'production' ? '/app/data/repo' : path.join(__dirname, '..', 'data', 'repo');

export async function saveZip(jobId, zipBuffer) {
    const jobDir = path.join(DATA_DIR, String(jobId));
    await fs.mkdir(jobDir, { recursive: true });
    await fs.writeFile(path.join(jobDir, 'original.zip'), zipBuffer);
}

export async function loadRepoFiles(jobId) {
    const jobDir = path.join(DATA_DIR, String(jobId));
    const zipPath = path.join(jobDir, 'original.zip');

    try {
        const data = await fs.readFile(zipPath);
        const zip = await JSZip.loadAsync(data);
        const files = [];

        for (const [filename, file] of Object.entries(zip.files)) {
            if (!file.dir) {
                const content = await file.async("string");
                files.push({ path: filename, content });
            }
        }
        return files;
    } catch (error) {
        console.error(`Error loading repo files for job ${jobId}:`, error);
        return [];
    }
}

export async function loadFixedZip(jobId) {
    const jobDir = path.join(DATA_DIR, String(jobId));
    const filePath = path.join(jobDir, 'fixed.zip');
    return await fs.readFile(filePath);
}

export async function saveFixedZip(jobId, zipBuffer) {
    const jobDir = path.join(DATA_DIR, String(jobId));
    await fs.mkdir(jobDir, { recursive: true });
    await fs.writeFile(path.join(jobDir, 'fixed.zip'), zipBuffer);
}

export function getRepoPath(jobId) {
    return path.join(DATA_DIR, String(jobId));
}
