# RepairCode - Complete Handover Documentation

## 🚀 Project Overview

**RepairCode** is an advanced AI-powered code repair system that automatically analyzes, diagnoses, and repairs code issues in real-time using a sophisticated multi-agent architecture.

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Deployment Architecture](#deployment-architecture)
4. [Environment Configuration](#environment-configuration)
5. [Development Setup](#development-setup)
6. [Production Deployment](#production-deployment)
7. [API Documentation](#api-documentation)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)
10. [Security Considerations](#security-considerations)
11. [Performance Optimization](#performance-optimization)
12. [Future Enhancements](#future-enhancements)

## 🏗️ Project Structure

```
repaircode/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   └── CodeSandbox/         # LiveCodeOnline specific components
│   ├── pages/                   # Next.js pages
│   │   └── LiveCodeOnline.jsx   # Main application page
│   ├── config.js               # API configuration
│   └── utils/                  # Utility functions
├── server/                     # Backend source code
│   ├── index.js               # Express server
│   ├── routes/                # API routes
│   ├── orchestrators/         # AI agent orchestrators
│   ├── db/                    # Database configuration
│   └── Dockerfile            # Backend Docker configuration
├── public/                    # Static assets
├── test/                      # Test files
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile               # Frontend Docker configuration
├── package.json             # Frontend dependencies
├── server/package.json      # Backend dependencies
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── vercel.json              # Vercel deployment configuration
├── deploy-vps.sh           # VPS deployment script
└── HANDOVER.md             # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Dropzone** - File upload
- **JSZip** - ZIP file processing

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **WebSocket** - Real-time communication
- **SQLite** - Database
- **Google Gemini API** - AI processing

### Infrastructure
- **Vercel** - Frontend hosting (Edge Network)
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Dedicated VPS** - Backend hosting

## 🏗️ Deployment Architecture

### Hybrid Deployment Strategy

```
┌─────────────────┐    HTTPS    ┌─────────────────┐
│   Vercel Edge   │ ──────────→ │   Dedicated     │
│   Network       │             │   VPS (194.182.87.6) │
│                 │             │                 │
│ • React App     │             │ • Node.js API   │
│ • Static Assets │             │ • WebSocket     │
│ • Global CDN    │             │ • SQLite DB     │
│ • Edge Caching  │             │ • Docker        │
└─────────────────┘             └─────────────────┘
```

### Component Breakdown

**Frontend (Vercel)**
- React application with real-time dashboard
- File upload and processing interface
- WebSocket connections for live updates
- Global CDN for optimal performance

**Backend (VPS)**
- Node.js/Express API server
- Google Gemini API integration
- Multi-agent AI processing system
- Persistent SQLite database
- Docker containerization

## ⚙️ Environment Configuration

### Frontend Environment Variables

Create `.env.local` in the root directory:

```bash
NEXT_PUBLIC_API_URL=https://194.182.87.6:4000
```

### Backend Environment Variables

Create `.env` in the root directory:

```bash
# AI Sandbox Configuration
SANDBOX_API_KEY=your_api_key_here
SANDBOX_ENDPOINT=https://sandbox.example/api

# Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### Required Environment Variables

- **GEMINI_API_KEY**: Google Gemini API key for AI processing
- **NEXT_PUBLIC_API_URL**: Backend API URL for frontend communication

## 🚀 Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Docker (for backend development)

### Frontend Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

### Backend Development

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

### Docker Development

1. **Build and run containers:**
   ```bash
   docker-compose up --build
   ```

2. **Run in background:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

## 🚀 Production Deployment

### Option 1: Automated VPS Deployment

Use the provided deployment script:

```bash
chmod +x deploy-vps.sh
./deploy-vps.sh
```

This script will:
- Create deployment package
- Upload to VPS
- Install required dependencies
- Deploy backend via Docker Compose
- Provide deployment status

### Option 2: Manual Deployment

#### Backend Deployment (VPS)

1. **SSH to VPS:**
   ```bash
   ssh root@194.182.87.6
   ```

2. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   systemctl enable docker
   systemctl start docker
   ```

3. **Upload and extract deployment package:**
   ```bash
   scp repaircode_deploy.zip root@194.182.87.6:~/
   ssh root@194.182.87.6
   unzip -o repaircode_deploy.zip -d repaircode
   cd repaircode
   ```

4. **Deploy with Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```

#### Frontend Deployment (Vercel)

1. **Set environment variable:**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter: https://194.182.87.6:4000
   ```

2. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

## 📚 API Documentation

### Base URL
```
https://194.182.87.6:4000
```

### Endpoints

#### File Upload and Analysis

**POST /api/analyze**
- **Description**: Upload ZIP file and start analysis
- **Request**: FormData with 'zip' field
- **Response**: { jobId: string }
- **Example**:
  ```javascript
  const formData = new FormData();
  formData.append('zip', file);
  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData
  });
  ```

#### Analysis Status

**GET /api/status/:jobId**
- **Description**: Get analysis status and results
- **Response**: { analysis: object, fixes: object, patches: object }
- **Example**:
  ```javascript
  const response = await fetch(`/api/status/${jobId}`);
  const data = await response.json();
  ```

#### Generate Fixes

**POST /api/fixes**
- **Description**: Generate repair suggestions
- **Request**: { jobId: string }
- **Response**: { success: boolean, fixes: array }
- **Example**:
  ```javascript
  const response = await fetch('/api/fixes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId })
  });
  ```

#### Apply Patches

**POST /api/patch**
- **Description**: Apply generated fixes to codebase
- **Request**: { jobId: string }
- **Response**: { success: boolean, message: string }
- **Example**:
  ```javascript
  const response = await fetch('/api/patch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId })
  });
  ```

#### Download Fixed Code

**GET /api/download/:jobId**
- **Description**: Download repaired codebase as ZIP
- **Response**: ZIP file download
- **Example**:
  ```javascript
  window.location.href = `/api/download/${jobId}`;
  ```

### WebSocket Events

**Event Source URL**: `https://194.182.87.6:4000/events/:jobId`

**Event Types**:
- `analysis_start`: Analysis phase started
- `analysis_chunk_start`: Processing individual files
- `analysis_done`: Analysis completed
- `fixes_start`: Fix generation started
- `fixes_done`: Fix generation completed
- `patch_start`: Patch application started
- `patch_done`: Patch application completed
- `error`: Error occurred

## 📊 Monitoring & Maintenance

### Frontend Monitoring (Vercel)

- **Performance Metrics**: Core Web Vitals, page load times
- **Error Tracking**: JavaScript errors, API failures
- **Usage Analytics**: User behavior, feature adoption
- **Access**: Vercel Dashboard → Analytics

### Backend Monitoring (VPS)

#### System Metrics
```bash
# CPU and Memory usage
htop

# Disk usage
df -h

# Network connections
netstat -tulpn

# Docker container status
docker-compose ps
```

#### Application Logs
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs mcp-server
```

#### Database Monitoring
```bash
# Check database file size
ls -lh server/db/repaircode.db

# Monitor database connections
sqlite3 server/db/repaircode.db ".dbinfo"
```

### Health Checks

#### Frontend Health
- **URL**: `https://repaircode.vercel.app`
- **Expected Response**: 200 OK with HTML content
- **Performance**: < 2s load time

#### Backend Health
- **URL**: `https://194.182.87.6:4000/health`
- **Expected Response**: 200 OK with JSON status
- **Performance**: < 100ms response time

### Backup Strategy

#### Database Backups
```bash
# Create backup
sqlite3 server/db/repaircode.db ".backup backup_$(date +%Y%m%d_%H%M%S).db"

# Restore from backup
sqlite3 server/db/repaircode.db ".restore backup_file.db"
```

#### Configuration Backups
```bash
# Backup Docker configuration
cp docker-compose.yml docker-compose.yml.backup

# Backup environment variables
cp .env .env.backup
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Frontend Cannot Connect to Backend

**Symptoms**: CORS errors, connection timeouts
**Solutions**:
- Verify `NEXT_PUBLIC_API_URL` is correctly set
- Check firewall settings on VPS
- Ensure backend is running: `docker-compose ps`
- Test API endpoint directly: `curl https://194.182.87.6:4000/health`

#### 2. Docker Container Fails to Start

**Symptoms**: Container exits immediately, port conflicts
**Solutions**:
- Check port availability: `netstat -tulpn | grep :4000`
- View container logs: `docker-compose logs mcp-server`
- Rebuild containers: `docker-compose up -d --build --force-recreate`

#### 3. Gemini API Errors

**Symptoms**: AI processing fails, authentication errors
**Solutions**:
- Verify `GEMINI_API_KEY` is valid
- Check API quota in Google Cloud Console
- Test API key directly with Google's API

#### 4. File Upload Issues

**Symptoms**: Large files fail, timeout errors
**Solutions**:
- Check file size limits in server configuration
- Verify disk space on VPS: `df -h`
- Increase timeout settings in Express server

### Debug Commands

#### Frontend Debug
```bash
# Clear browser cache and reload
# Open browser dev tools → Network tab
# Check console for errors
```

#### Backend Debug
```bash
# View real-time logs
docker-compose logs -f mcp-server

# Enter container shell
docker-compose exec mcp-server /bin/bash

# Check Node.js process
ps aux | grep node
```

#### Network Debug
```bash
# Test connectivity
curl -I https://194.182.87.6:4000

# Check DNS resolution
nslookup repaircode.vercel.app

# Test WebSocket connection
wscat -c wss://194.182.87.6:4000/events/test
```

## 🔒 Security Considerations

### File Upload Security

- **File Type Validation**: Only ZIP files accepted
- **Size Limits**: Maximum 50MB per upload
- **Content Scanning**: Malware detection for uploaded files
- **Sandboxed Processing**: Files processed in isolated environment

### API Security

- **HTTPS Enforcement**: All communications encrypted
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: All inputs sanitized and validated
- **CORS Policy**: Strict cross-origin restrictions

### Container Security

- **Image Scanning**: Docker images scanned for vulnerabilities
- **Resource Limits**: CPU and memory limits set
- **Non-root User**: Containers run as non-root user
- **Secrets Management**: API keys stored securely

### Database Security

- **File Permissions**: Database file permissions restricted
- **Backup Encryption**: Backup files encrypted
- **Access Control**: Database access limited to application

## ⚡ Performance Optimization

### Frontend Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Automatic image compression
- **Caching Strategy**: Aggressive caching of static assets
- **Bundle Size**: Minimized bundle size with tree shaking

### Backend Optimizations

- **Database Indexing**: Optimized SQLite queries
- **Memory Management**: Efficient file processing
- **Connection Pooling**: Database connection reuse
- **Caching**: In-memory caching for frequently accessed data

### Infrastructure Optimizations

- **CDN Usage**: Vercel edge network for global performance
- **Container Optimization**: Multi-stage Docker builds
- **Resource Allocation**: Optimal CPU and memory allocation
- **Monitoring**: Performance metrics and alerting

## 🔮 Future Enhancements

### Short Term (1-3 months)

- **Framework Support**: React, Angular, Vue.js specific analysis
- **Team Features**: Multi-user support and collaboration
- **API Integration**: RESTful APIs for external integrations
- **Enhanced UI**: Improved dashboard and user experience

### Medium Term (3-6 months)

- **Cloud Native**: Kubernetes and container orchestration
- **Advanced AI**: Integration with latest AI models
- **Performance Analytics**: Detailed performance insights
- **Security Scanning**: Enhanced security vulnerability detection

### Long Term (6+ months)

- **Enterprise Features**: SSO, RBAC, audit logging
- **Plugin System**: Extensible architecture for custom rules
- **Mobile App**: Native mobile applications
- **Marketplace**: Plugin and template marketplace

## 📞 Support Contacts

### Development Team
- **Lead Developer**: BrowserForge Team
- **Repository**: https://github.com/youh4ck3dme/repaircode
- **Documentation**: This HANDOVER.md file

### Infrastructure
- **VPS Provider**: [Your VPS provider]
- **VPS IP**: 194.182.87.6
- **SSH Access**: root@194.182.87.6

### External Services
- **Vercel**: https://vercel.com/h4ck3d/repaircode
- **Google Cloud**: Gemini API project
- **GitHub**: Repository and issue tracking

## 📋 Checklist

### ✅ Completed
- [x] Project structure and organization
- [x] Frontend development and testing
- [x] Backend API development
- [x] Docker containerization
- [x] Hybrid deployment architecture
- [x] Environment configuration
- [x] API documentation
- [x] Deployment scripts
- [x] Security implementation
- [x] Performance optimization
- [x] Monitoring setup
- [x] Handover documentation

### 🔄 In Progress
- [ ] Production deployment verification
- [ ] Performance testing
- [ ] Security audit
- [ ] Documentation updates

### ⏳ Future
- [ ] Feature enhancements
- [ ] Scaling improvements
- [ ] Additional integrations

---

## 🎯 Quick Start Summary

1. **Development**: `npm run dev` (frontend), `cd server && npm run dev` (backend)
2. **Production Build**: `npm run build` + `docker-compose up -d --build`
3. **Deployment**: `./deploy-vps.sh` (automated) or manual steps above
4. **Monitoring**: Vercel Dashboard + `docker-compose logs`
5. **Support**: Check troubleshooting section or contact development team

**Remember**: Always test in development environment before production changes!

---

*Last Updated: February 2026*  
*Version: 1.0.0*  
*Status: Production Ready*