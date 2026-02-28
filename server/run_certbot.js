import { Client } from 'ssh2';

const conn = new Client();
const config = {
    host: '194.182.87.6',
    port: 22,
    username: 'root',
    password: 'Poklop123#####'
};

conn.on('ready', () => {
    console.log('🚀 Attempting SSL Generation (Certbot)...');

    // --non-interactive --agree-tos --email allows for automatic setup
    // Note: This will fail if DNS is not yet pointed to the VPS IP
    conn.exec('certbot --nginx -d rubberduck.space --non-interactive --agree-tos --email admin@rubberduck.space || echo "SSL generation skipped or failed (likely DNS not ready)"', (err, stream) => {
        if (err) throw err;

        stream.on('data', (data) => {
            process.stdout.write(data.toString());
        }).on('close', () => {
            console.log('✅ Certbot Attempt Finished.');
            conn.end();
        });
    });
}).connect(config);
