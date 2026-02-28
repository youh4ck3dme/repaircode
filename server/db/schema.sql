-- RepairCode SQLite Schema (Optimized for Production)

CREATE TABLE IF NOT EXISTS analysis_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'done', 'failed')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS analysis_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL REFERENCES analysis_jobs(id) ON DELETE CASCADE,
  analysis_json TEXT NOT NULL,
  fixes_json TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS patches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL REFERENCES analysis_jobs(id) ON DELETE CASCADE,
  patch_json TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
