import { Client } from 'ssh2';
const conn = new Client();
conn.on('ready', () => {
    conn.exec('ls /etc/nginx/sites-enabled/ && cat /etc/nginx/sites-enabled/rubberduck.space || echo "No rubberduck.space config found"', (err, stream) => {
        if (err) throw err;
        stream.on('data', d => process.stdout.write(d.toString()));
        stream.on('close', () => {
            conn.exec('certbot certificates', (err2, stream2) => {
                if (err2) throw err2;
                stream2.on('data', d => process.stdout.write(d.toString()));
                stream2.on('close', () => {
                    conn.exec('docker-compose -f /root/repaircode/docker-compose.yml ps', (err3, stream3) => {
                         if (err3) throw err3;
                         stream3.on('data', d => process.stdout.write(d.toString()));
                         stream3.on('close', () => conn.end());
                    });
                });
            });
        });
    });
}).connect({ host: '194.182.87.6', username: 'root', password: 'Poklop123#####' });
