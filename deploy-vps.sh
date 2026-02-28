#!/bin/bash

# RepairCode VPS Deployment Script
# This script deploys the backend to your VPS via Docker

set -e

echo "🚀 Starting RepairCode VPS Deployment..."

# Configuration
VPS_HOST="194.182.87.6"
VPS_USER="root"
PROJECT_NAME="repaircode"
BACKEND_PORT="4000"
FRONTEND_PORT="8080"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
print_status "Checking deployment files..."
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found!"
    exit 1
fi

if [ ! -f "server/Dockerfile" ]; then
    print_error "server/Dockerfile not found!"
    exit 1
fi

print_status "All required files found."

# Create deployment package
print_status "Creating deployment package..."
if [ -f "repaircode_deploy.tar.gz" ]; then
    print_warning "repaircode_deploy.tar.gz already exists, removing..."
    rm repaircode_deploy.tar.gz
fi

# Create a clean deployment package
print_status "Creating deployment archive..."
tar -czf repaircode_deploy.tar.gz \
    --exclude="*.git*" \
    --exclude="node_modules/*" \
    --exclude="test/*" \
    --exclude="*.md" \
    --exclude="*.ps1" \
    --exclude="*.sh" \
    --exclude="deploy*" \
    --exclude="VPS_INSTRUCTIONS.md" \
    docker-compose.yml \
    server/ \
    .env \
    package.json \
    package-lock.json

print_status "Deployment package created: repaircode_deploy.tar.gz"

# Upload to VPS
print_status "Uploading to VPS ($VPS_HOST)..."
scp repaircode_deploy.tar.gz $VPS_USER@$VPS_HOST:~/

if [ $? -eq 0 ]; then
    print_status "Upload successful!"
else
    print_error "Upload failed!"
    exit 1
fi

# SSH into VPS and deploy
print_status "Deploying on VPS..."

ssh $VPS_USER@$VPS_HOST << 'EOF'
    # Navigate to home directory
    cd ~
    
    # Install required packages if not already installed
    if ! command -v docker &> /dev/null; then
        print_status "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        systemctl enable docker
        systemctl start docker
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_status "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    # Stop existing containers if running
    if docker-compose ps | grep -q "repaircode"; then
        print_status "Stopping existing containers..."
        docker-compose down
    fi
    
    # Remove old directory if exists
    if [ -d "repaircode" ]; then
        rm -rf repaircode
    fi
    
    # Extract deployment package
    print_status "Extracting deployment package..."
    mkdir -p repaircode
    tar -xzf repaircode_deploy.tar.gz -C repaircode
    
    # Navigate to project directory
    cd repaircode
    
    # Ensure .env file exists
    if [ ! -f ".env" ]; then
        print_warning ".env file not found, creating from example..."
        cp .env.example .env
        print_warning "Please update .env with your Gemini API key"
    fi
    
    # Build and start containers
    print_status "Building and starting containers..."
    docker-compose up -d --build
    
    # Check if containers are running
    sleep 5
    docker-compose ps
    
    # Show logs
    print_status "Backend logs:"
    docker-compose logs mcp-server
    
    print_status "Frontend logs:"
    docker-compose logs frontend
    
    print_status "Deployment completed!"
    print_status "Backend API: http://$VPS_HOST:$BACKEND_PORT"
    print_status "Frontend: http://$VPS_HOST:$FRONTEND_PORT"
EOF

if [ $? -eq 0 ]; then
    print_status "VPS deployment completed successfully!"
    echo ""
    echo "🎉 RepairCode has been deployed to your VPS!"
    echo "   Backend API: http://$VPS_HOST:$BACKEND_PORT"
    echo "   Frontend: http://$VPS_HOST:$FRONTEND_PORT"
    echo ""
    echo "Next steps:"
    echo "1. Update your Vercel frontend with NEXT_PUBLIC_API_URL=http://$VPS_HOST:$BACKEND_PORT"
    echo "2. Deploy frontend to Vercel"
    echo "3. Test the connection between frontend and backend"
else
    print_error "VPS deployment failed!"
    exit 1
fi