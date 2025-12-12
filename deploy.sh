#!/usr/bin/env bash
# ------------------------------------------------------------
# deploy.sh – Automated HTTPS Deployment for Nexify-Studio
# ------------------------------------------------------------
# 1. Configures Nginx for HTTP only (to allow Certbot verification).
# 2. Starts the stack.
# 3. Runs Certbot to get SSL certificates.
# 4. Re-configures Nginx for HTTPS.
# 5. Reloads Nginx.
# ------------------------------------------------------------

set -e

# --- Configuration ---
DOMAIN="nexify-studio.tech"
EMAIL="h4ck3d@h4ck3d.me"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_CONF="${PROJECT_DIR}/nginx/nginx.conf"

# --- Colors ---
BLUE='\033[1;34m'
GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m'

log() { echo -e "${BLUE}[DEPLOY]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# --- 1. Create Bootstrap Nginx Config (HTTP ONLY) ---
log "Creating bootstrap Nginx configuration (HTTP only)..."
mkdir -p "${PROJECT_DIR}/nginx"

cat > "$NGINX_CONF" <<EOF
user  nginx;
worker_processes  auto;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;

        # Challenge for Certbot
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Placeholder for other traffic during setup
        location / {
            return 200 'Setup in progress...';
            add_header Content-Type text/plain;
        }
    }
}
EOF

# --- 2. Start Services ---
log "Starting Docker services..."
docker-compose up -d --force-recreate nginx
docker-compose up -d --build

log "Waiting for Nginx to be ready..."
sleep 5

# --- 3. Request Certificates ---
log "Requesting Let's Encrypt certificates..."
docker run --rm \
  --pull always \
  -v "${PROJECT_DIR}/letsencrypt:/etc/letsencrypt" \
  -v "${PROJECT_DIR}/certbot-webroot:/var/www/certbot" \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d "$DOMAIN" -d "www.$DOMAIN"

# --- 4. Create Production Nginx Config (HTTPS Enabled) ---
log "Certificates obtained! Creating production Nginx configuration..."

cat > "$NGINX_CONF" <<EOF
user  nginx;
worker_processes  auto;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # --- HTTP Redirect ---
    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://\$host\$request_uri;
        }
    }

    # --- HTTPS ---
    server {
        listen 443 ssl;
        http2 on;
        server_name $DOMAIN www.$DOMAIN;

        ssl_certificate     /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

        ssl_protocols       TLSv1.2 TLSv1.3;
        ssl_ciphers         HIGH:!aNULL:!MD5;
        
        # Proxy to App
        location / {
            proxy_pass http://app:3000;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Proxy to API
        location /api/ {
            proxy_pass http://api:4000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_cache_bypass \$http_upgrade;
        }
    }
}
EOF

# --- 5. Reload Nginx ---
log "Reloading Nginx to apply SSL..."
docker-compose exec -T nginx nginx -s reload

success "Deployment Complete! Your site should be live at https://$DOMAIN"
