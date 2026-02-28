import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let dbInstance = null;

export async function getDb() {
    if (dbInstance) return dbInstance;

    const dbPath = path.join(__dirname, 'repaircode.db');
    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Initialize schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await dbInstance.exec(schema);

    return dbInstance;
}

export async function createJob() {
    const db = await getDb();
    const r = await db.run("INSERT INTO analysis_jobs (status) VALUES ('pending')");
    return r.lastID;
}

export async function setJobStatus(id, status) {
    const db = await getDb();
    await db.run(
        "UPDATE analysis_jobs SET status = ?, updated_at = datetime('now') WHERE id = ?",
        status,
        id
    );
}

export async function saveAnalysis(jobId, json) {
    const db = await getDb();
    await db.run(
        "INSERT INTO analysis_results (job_id, analysis_json) VALUES (?, ?)",
        jobId,
        JSON.stringify(json)
    );
}

export async function saveFixes(jobId, json) {
    const db = await getDb();
    await db.run(
        "UPDATE analysis_results SET fixes_json = ? WHERE job_id = ?",
        JSON.stringify(json),
        jobId
    );
}

export async function savePatch(jobId, json) {
    const db = await getDb();
    await db.run(
        "INSERT INTO patches (job_id, patch_json) VALUES (?, ?)",
        jobId,
        JSON.stringify(json)
    );
}

export async function getAnalysis(jobId) {
    const db = await getDb();
    const row = await db.get(
        "SELECT analysis_json FROM analysis_results WHERE job_id = ?",
        jobId
    );
    return row ? JSON.parse(row.analysis_json) : null;
}

export async function getFixes(jobId) {
    const db = await getDb();
    const row = await db.get(
        "SELECT fixes_json FROM analysis_results WHERE job_id = ?",
        jobId
    );
    return row ? JSON.parse(row.fixes_json) : null;
}

export async function getJobStatus(jobId) {
    const db = await getDb();
    return await db.get("SELECT * FROM analysis_jobs WHERE id = ?", jobId);
}
