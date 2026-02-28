import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const conn = new Client();
const config = {
    host: '194.182.87.6',
    port: 22,
    username: 'root',
    password: 'Poklop123#####'
};

const localFile = path.join(__dirname, '..', 'repaircode_deploy.tar.gz');
const remoteFile = '/root/repaircode_deploy.tar.gz';

console.log('🚀 Connecting to VPS...');

conn.on('ready', () => {
    console.log('✅ Connected. Starting SFTP upload...');

    conn.sftp((err, sftp) => {
        if (err) throw err;

        fs.createReadStream(localFile).pipe(sftp.createWriteStream(remoteFile))
            .on('close', () => {
                console.log('✅ Upload completed. Starting deployment commands...');

                conn.exec(`
          echo "🔍 Checking port 8080..."
          netstat -tulpn | grep :8080 || echo "Port 8080 is free"
          cd ~
          mkdir -p repaircode
          tar -xzf repaircode_deploy.tar.gz -C repaircode
          cd repaircode
          docker-compose down || true
          docker-compose up -d --build --force-recreate
          docker-compose ps
        `, (err, stream) => {
                    if (err) throw err;

                    stream.on('close', (code, signal) => {
                        console.log(`✅ Deployment finished with code ${code}.`);
                        conn.end();
                        process.exit(0);
                    }).on('data', (data) => {
                        process.stdout.write(data.toString());
                    }).stderr.on('data', (data) => {
                        process.stderr.write(data.toString());
                    });
                });
            });
    });
}).connect(config);

conn.on('error', (err) => {
    console.error('❌ Connection error:', err);
    process.exit(1);
});
