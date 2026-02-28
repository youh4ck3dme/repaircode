import { Client } from 'ssh2';

const conn = new Client();
const VPS = { host: '194.182.87.6', port: 22, username: 'root', password: 'Poklop123#####' };

const DOMAIN = 'rubberduck.space';
const EMAIL = 'admin@rubberduck.space';
const WEBROOT = '/var/www/html';
const NGINX_AVAILABLE = `/etc/nginx/sites-available/${DOMAIN}`;
const NGINX_ENABLED = `/etc/nginx/sites-enabled/${DOMAIN}`;

// HTTP-only config with webroot ACME location (used during cert issuance)
const httpConfig = `server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    # Required for Let's Encrypt ACME challenge (served from disk, not proxied)
    location /.well-known/acme-challenge/ {
        root ${WEBROOT};
    }

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
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_cache off;
    }
}
`;

// Final HTTPS config: HTTP redirects to HTTPS, SSL on port 443
const httpsConfig = `server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    # Keep ACME webroot available for auto-renewal
    location /.well-known/acme-challenge/ {
        root ${WEBROOT};
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

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
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_cache off;
    }
}
`;

function writeRemoteFile(sftp, remotePath, content) {
    return new Promise((resolve, reject) => {
        const buf = Buffer.from(content, 'utf8');
        sftp.open(remotePath, 'w', (err, handle) => {
            if (err) return reject(err);
            sftp.write(handle, buf, 0, buf.length, 0, (writeErr) => {
                if (writeErr) return reject(writeErr);
                sftp.close(handle, (closeErr) => {
                    if (closeErr) return reject(closeErr);
                    resolve();
                });
            });
        });
    });
}

function runSSH(cmd) {
    return new Promise((resolve, reject) => {
        conn.exec(cmd, (err, stream) => {
            if (err) return reject(err);
            let output = '';
            stream
                .on('data', d => { process.stdout.write(d.toString()); output += d; })
                .stderr.on('data', d => { process.stderr.write(d.toString()); output += d; });
            stream.on('close', (code) => {
                if (code !== 0) return reject(new Error(`Exit ${code}: ${cmd}`));
                resolve(output);
            });
        });
    });
}

function getSFTP() {
    return new Promise((resolve, reject) => {
        conn.sftp((err, sftp) => err ? reject(err) : resolve(sftp));
    });
}

conn.on('ready', async () => {
    try {
        // Step 1: Create webroot directory and open port 443
        console.log('\n[1/5] Creating webroot dir and opening port 443...');
        await runSSH(`mkdir -p ${WEBROOT} && ufw allow 443/tcp || true`);

        // Step 2: Write HTTP nginx config with ACME webroot location (avoids proxy_pass intercepting challenge)
        console.log('\n[2/5] Writing HTTP nginx config with ACME webroot location...');
        const sftp1 = await getSFTP();
        await writeRemoteFile(sftp1, NGINX_AVAILABLE, httpConfig);
        console.log('  Config written to ' + NGINX_AVAILABLE);

        // Step 3: Enable site and reload nginx
        console.log('\n[3/5] Enabling site and reloading nginx...');
        await runSSH(`ln -sf ${NGINX_AVAILABLE} ${NGINX_ENABLED} && nginx -t && systemctl reload nginx`);

        // Step 4: Run certbot with webroot authenticator (no nginx plugin, no interference)
        console.log('\n[4/5] Running certbot (webroot authenticator)...');
        await runSSH(
            `certbot certonly --webroot -w ${WEBROOT} -d ${DOMAIN} ` +
            `--non-interactive --agree-tos --email ${EMAIL} --keep-until-expiring`
        );

        // Step 5: Write final HTTPS nginx config (HTTP→HTTPS redirect + SSL on 443)
        console.log('\n[5/5] Writing HTTPS nginx config...');
        const sftp2 = await getSFTP();
        await writeRemoteFile(sftp2, NGINX_AVAILABLE, httpsConfig);

        // Step 6: Reload nginx with SSL config
        console.log('  Testing and reloading nginx with SSL...');
        await runSSH(`nginx -t && systemctl reload nginx`);

        console.log(`\n✅ Done! https://${DOMAIN} is now live with SSL.`);
        console.log('   HTTP → HTTPS redirect is active.');
        console.log('   Certificate auto-renewal is managed by certbot systemd timer.');
    } catch (err) {
        console.error('\n❌ SSL installation failed:', err.message);
        process.exit(1);
    } finally {
        conn.end();
    }
}).connect(VPS);
