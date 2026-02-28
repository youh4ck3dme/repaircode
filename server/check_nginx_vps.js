import { Client } from 'ssh2';

const conn = new Client();
const config = {
    host: '194.182.87.6',
    port: 22,
    username: 'root',
    password: 'Poklop123#####'
};

conn.on('ready', () => {
    console.log('🔍 Checking Nginx Config on VPS...');
    conn.exec('cat /etc/nginx/sites-enabled/rubberduck.space && nginx -t', (err, stream) => {
        if (err) throw err;
        stream.on('data', (data) => {
            process.stdout.write(data.toString());
        }).on('close', () => {
            conn.end();
        });
    });
}).connect(config);
