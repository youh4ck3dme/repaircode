/**
 * Deploys updated package.json + .env to VPS and rebuilds the mcp-server container.
 * Run: node server/setup_github_env.js
 *
 * Set these before running:
 *   GITHUB_CLIENT_ID=...
 *   GITHUB_CLIENT_SECRET=...
 */
import { Client } from 'ssh2';

const VPS = { host: '194.182.87.6', port: 22, username: 'root', password: 'Poklop123#####' };

// ── Fill in your GitHub OAuth App credentials ──────────────────────────────
const GITHUB_CLIENT_ID     = process.env.GITHUB_CLIENT_ID     || 'REPLACE_ME';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'REPLACE_ME';
const GITHUB_REDIRECT_URI  = 'https://rubberduck.space/api/github/callback';

// ── Known keys from local .env ─────────────────────────────────────────────
const GEMINI_API_KEY = 'AIzaSyCawXx5VxiocGRpwO-aVdpA5SV_qgx2bZM';

const envContent = `NODE_ENV=production
GEMINI_API_KEY=${GEMINI_API_KEY}
GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
GITHUB_OAUTH_REDIRECT_URI=${GITHUB_REDIRECT_URI}
`;

const packageJson = JSON.stringify({
  name: "repaircode-api",
  version: "1.0.0",
  type: "module",
  description: "Backend API for RepairCode AI Pipeline",
  main: "index.js",
  scripts: { start: "node index.js", dev: "nodemon index.js" },
  dependencies: {
    "@google/generative-ai": "^0.1.3",
    "@octokit/rest": "^20.1.1",
    "ajv": "^8.18.0",
    "ajv-formats": "^3.0.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-fileupload": "^1.4.1",
    "form-data": "^4.0.5",
    "jsonwebtoken": "^9.0.2",
    "jszip": "^3.10.1",
    "multer": "^1.4.5-lts.1",
    "node-fetch": "^2.7.0",
    "sqlite": "^5.1.1",
    "sqlite3": "^5.1.6",
    "ssh2": "^1.17.0"
  },
  devDependencies: { nodemon: "^3.0.1" }
}, null, 2);

function writeFile(sftp, remotePath, content) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(content, 'utf8');
    sftp.open(remotePath, 'w', (err, handle) => {
      if (err) return reject(err);
      sftp.write(handle, buf, 0, buf.length, 0, (e2) => {
        if (e2) return reject(e2);
        sftp.close(handle, (e3) => e3 ? reject(e3) : resolve());
      });
    });
  });
}

function getSFTP(conn) {
  return new Promise((r, j) => conn.sftp((e, s) => e ? j(e) : r(s)));
}

function run(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = '';
      stream.on('data', d => { process.stdout.write(d.toString()); out += d; });
      stream.stderr.on('data', d => { process.stderr.write(d.toString()); out += d; });
      stream.on('close', code => code !== 0 ? reject(new Error(`Exit ${code}`)) : resolve(out));
    });
  });
}

if (GITHUB_CLIENT_ID === 'REPLACE_ME') {
  console.error('❌ Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET env vars before running.');
  console.error('   Example: GITHUB_CLIENT_ID=xxx GITHUB_CLIENT_SECRET=yyy node server/setup_github_env.js');
  process.exit(1);
}

const conn = new Client();
conn.on('ready', async () => {
  try {
    const sftp = await getSFTP(conn);

    console.log('[1/4] Writing .env to VPS...');
    await writeFile(sftp, '/root/repaircode/.env', envContent);

    console.log('[2/4] Writing updated package.json to VPS...');
    await writeFile(sftp, '/root/repaircode/server/package.json', packageJson);

    console.log('[3/4] Rebuilding mcp-server container (npm install + docker-compose up)...');
    await run(conn,
      'cd /root/repaircode && ' +
      'docker-compose build --no-cache mcp-server && ' +
      'docker-compose up -d mcp-server'
    );

    console.log('[4/4] Waiting 5s then checking status...');
    await new Promise(r => setTimeout(r, 5000));
    await run(conn, 'docker ps --filter name=repaircode --format "table {{.Names}}\\t{{.Status}}"');
    await run(conn, 'docker logs repaircode_mcp-server_1 --tail 10 2>&1');
    await run(conn, 'curl -s http://localhost:4000/health || echo "health check failed"');

    console.log('\n✅ Done! Backend is rebuilt with GitHub OAuth support.');
    console.log(`   OAuth callback: ${GITHUB_REDIRECT_URI}`);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  } finally {
    conn.end();
  }
}).connect(VPS);
