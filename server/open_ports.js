import { Client } from 'ssh2';

const conn = new Client();
const config = {
    host: '194.182.87.6',
    port: 22,
    username: 'root',
    password: 'Poklop123#####'
};

conn.on('ready', () => {
    console.log('🚀 Opening Ports 8082 and 4000 in Firewall...');

    conn.exec('ufw allow 8082/tcp && ufw allow 4000/tcp && ufw status', (err, stream) => {
        if (err) throw err;

        stream.on('data', (data) => {
            process.stdout.write(data.toString());
        }).on('close', () => {
            conn.end();
        });
    });
}).connect(config);
