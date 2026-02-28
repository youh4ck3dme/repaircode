import { Client } from 'ssh2';

const conn = new Client();
const config = {
    host: '194.182.87.6',
    port: 22,
    username: 'root',
    password: 'Poklop123#####'
};

const nginxConfig = `
server {
    listen 80;
    server_name rubberduck.space;

    location / {
        proxy_pass http://localhost:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /events {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # SSE settings
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_cache off;
    }
}
`;

conn.on('ready', () => {
    console.log('🚀 Deploying Nginx Config...');

    conn.exec(`
    echo "${nginxConfig.replace(/"/g, '\\"')}" > /etc/nginx/sites-available/rubberduck.space
    ln -sf /etc/nginx/sites-available/rubberduck.space /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
  `, (err, stream) => {
        if (err) throw err;

        stream.on('data', (data) => {
            process.stdout.write(data.toString());
        }).on('close', () => {
            console.log('✅ Nginx Config Deployed.');
            conn.end();
        });
    });
}).connect(config);
