#!/bin/bash

# RepairCode Production Deploy Script
echo "🚀 Starting RepairCode Deployment..."

# 1. Create necessary persistent directories
mkdir -p server/db
mkdir -p server/repo
chmod -R 777 server/db server/repo

# 2. Check for .env file
if [ ! -f .env ]; then
    echo "⚠️ Warning: .env file missing. Using .env.example as template."
    cp .env.example .env
    echo "Please edit .env and add your GEMINI_API_KEY!"
fi

# 3. Stop old containers
docker-compose down

# 4. Build and Start
docker-compose up -d --build

echo "✅ Deployment completed successfully!"
echo "Frontend: http://localhost:8080"
echo "Backend API: http://localhost:4000"
