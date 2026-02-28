import { Client } from 'ssh2';

const conn = new Client();
const config = {
    host: '194.182.87.6',
    port: 22,
    username: 'root',
    password: 'Poklop123#####'
};

conn.on('ready', () => {
    console.log('🚀 Finalizing VPS Health Check...');

    conn.exec(`
    echo "--- STATUS ---"
    docker ps -a --filter name=repaircode --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "--- BACKEND HEALTH CHECK ---"
    curl -s http://localhost:4000/health || echo "Backend unreachable"
    echo ""
    echo "--- BACKEND RECENT LOGS ---"
    docker logs repaircode_mcp-server_1 --tail 10
  `, (err, stream) => {
        if (err) throw err;

        stream.on('close', (code, signal) => {
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data.toString());
        }).stderr.on('data', (data) => {
            process.stderr.write(data.toString());
        });
    });
}).connect(config);

conn.on('error', (err) => {
    console.error('❌ Connection error:', err);
    process.exit(1);
});
