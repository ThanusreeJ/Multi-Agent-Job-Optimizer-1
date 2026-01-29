# 🐳 Docker Deployment Guide

Complete guide for containerizing and deploying the Multi-Agent Production Job Optimizer using Docker.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Production Deployment](#production-deployment)
- [Development Mode](#development-mode)
- [Environment Variables](#environment-variables)
- [Docker Commands Reference](#docker-commands-reference)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)

---

## Prerequisites

Ensure you have installed **one of the following**:

### Option 1: Docker (Recommended)

- **Docker**: 20.10.0 or higher
- **Docker Compose**: 2.0.0 or higher

**Installation:**
- **Windows/Mac**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: 
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo apt-get install docker-compose-plugin
  ```

**Verify Installation:**
```bash
docker --version
docker compose version
```

### Option 2: Podman (Docker Alternative)

Podman is a daemonless container engine that's fully compatible with Docker. All Docker commands and compose files work with Podman.

**Installation:**
- **Windows**: [Podman Desktop](https://podman.io/getting-started/installation#windows) or via Chocolatey:
  ```powershell
  choco install podman-desktop
  ```
- **Linux**: 
  ```bash
  sudo apt-get -y install podman podman-compose
  # OR
  sudo dnf -y install podman podman-compose
  ```

**Verify Installation:**
```powershell
podman --version
podman compose version
```

**Note**: 
- Modern Podman versions (4.0+) support `podman compose` (without hyphen) using Docker Compose as a backend.
- If you have Podman, replace all `docker compose` commands with `podman compose` throughout this guide.
- Alternatively, install `podman-compose` via pip: `pip install podman-compose`

---

## Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/multi-agent-job-optimizer.git
cd multi-agent-job-optimizer
```

### 2. Create Environment File

Create `backend/.env` with your API keys:

```env
# REQUIRED: Groq API Key
GROQ_API_KEY=your_groq_api_key_here

# OPTIONAL: LangSmith Tracing
LANGSMITH_API_KEY=your_langsmith_key_here
LANGSMITH_PROJECT=multi-agent-job-optimizer
LANGCHAIN_TRACING_V2=true
```

### 3. Build and Run (Production)

**Docker:**
```bash
docker compose up --build
```

**Podman:**
```powershell
podman compose up --build
```

**Access the Application:**
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 4. Stop Services

**Docker:**
```bash
# Graceful shutdown
docker compose down

# Remove volumes as well
docker compose down -v
```

**Podman:**
```powershell
# Graceful shutdown
podman compose down

# Remove volumes as well
podman compose down -v
```

---

## 🐳 Using Podman Instead of Docker

If you have **Podman** installed, use these command equivalents:

| Docker Command | Podman Command |
|----------------|----------------|
| `docker compose up` | `podman compose up` |
| `docker compose build` | `podman compose build` |
| `docker compose down` | `podman compose down` |
| `docker compose ps` | `podman compose ps` |
| `docker compose logs` | `podman compose logs` |
| `docker compose exec` | `podman compose exec` |
| `docker ps` | `podman ps` |
| `docker images` | `podman images` |
| `docker run` | `podman run` |

**Windows PowerShell Users**: You can create an alias to seamlessly use `docker` commands with Podman:

```powershell
# Add to your PowerShell profile (run: notepad $PROFILE)
Set-Alias -Name docker -Value podman

# Reload profile
. $PROFILE
```

After setting the alias, you can use all `docker` and `docker compose` commands as shown in this guide, and they'll automatically use Podman.

---

## Production Deployment

### Build Production Images

```bash
docker compose build
```

This creates:
- **Backend**: Python 3.11 slim image with FastAPI + LangChain
- **Frontend**: Multi-stage build (Node 20 builder → Nginx Alpine production)

### Run in Detached Mode

```bash
docker compose up -d
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### Check Service Health

```bash
docker compose ps
```

Expected output:
```
NAME                          STATUS              PORTS
job-optimizer-backend         Up (healthy)        0.0.0.0:8000->8000/tcp
job-optimizer-frontend        Up (healthy)        0.0.0.0:80->80/tcp
```

### Scale Services (Optional)

```bash
# Run 3 backend instances behind a load balancer
docker compose up -d --scale backend=3
```

---

## Development Mode

For hot-reloading during development:

### 1. Use Development Compose File

```bash
docker compose -f docker-compose.dev.yml up --build
```

**Features:**
- ✅ Backend hot-reload (Uvicorn auto-restart on file changes)
- ✅ Frontend Vite dev server with HMR
- ✅ Source code mounted as volumes
- ✅ LangSmith tracing enabled by default

**Access:**
- **Frontend Dev Server**: http://localhost:5173
- **Backend**: http://localhost:8000

### 2. Rebuild After Dependency Changes

```bash
# If you modify package.json or requirements.txt
docker compose -f docker-compose.dev.yml up --build
```

### 3. Run Individual Services

```bash
# Backend only
docker compose -f docker-compose.dev.yml up backend

# Frontend only (requires backend running)
docker compose -f docker-compose.dev.yml up frontend-dev
```

---

## Environment Variables

### Backend Environment

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | ✅ Yes | - | Groq API key for LLM access |
| `LANGSMITH_API_KEY` | ❌ No | - | LangSmith tracing API key |
| `LANGSMITH_PROJECT` | ❌ No | `multi-agent-job-optimizer` | LangSmith project name |
| `LANGCHAIN_TRACING_V2` | ❌ No | `false` | Enable LangSmith tracing |

### Frontend Environment (Production)

API requests are proxied through Nginx to `http://backend:8000/api`

### Frontend Environment (Development)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ❌ No | `http://localhost:8000` | Backend API URL |

---

## Docker Commands Reference

### Build & Start

```bash
# Production
docker compose up -d --build

# Development
docker compose -f docker-compose.dev.yml up --build

# Force rebuild (no cache)
docker compose build --no-cache
```

### Stop & Remove

```bash
# Stop services
docker compose stop

# Stop and remove containers
docker compose down

# Remove everything (containers, networks, volumes, images)
docker compose down -v --rmi all
```

### Logs & Debugging

```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View last 100 lines
docker compose logs --tail=100

# Specific service
docker compose logs -f backend
```

### Execute Commands in Containers

```bash
# Access backend shell
docker compose exec backend bash

# Access frontend shell (production)
docker compose exec frontend sh

# Run Python shell in backend
docker compose exec backend python

# Install new Python package
docker compose exec backend pip install package-name

# Install new npm package (dev mode)
docker compose -f docker-compose.dev.yml exec frontend-dev npm install package-name
```

### Inspect & Monitor

```bash
# List running containers
docker compose ps

# View resource usage
docker stats

# Inspect service configuration
docker compose config

# Check health status
docker inspect job-optimizer-backend | grep -i health
```

---

## Troubleshooting

### Issue: "Cannot connect to backend"

**Symptoms**: Frontend shows "Network Error"

**Solutions**:
```bash
# 1. Check backend is running
docker compose ps

# 2. Check backend logs
docker compose logs backend

# 3. Verify backend health
curl http://localhost:8000/

# 4. Check network connectivity
docker compose exec frontend ping backend
```

### Issue: "GROQ_API_KEY not found"

**Solution**:
```bash
# 1. Ensure .env file exists in backend/
ls backend/.env

# 2. Verify key is set
docker compose exec backend printenv GROQ_API_KEY

# 3. Recreate containers with new env
docker compose up -d --force-recreate
```

### Issue: Port already in use

**Symptoms**: `Error starting userland proxy: listen tcp 0.0.0.0:8000: bind: address already in use`

**Solutions**:
```bash
# Option 1: Stop conflicting process
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9

# Option 2: Change port in docker-compose.yml
ports:
  - "8001:8000"  # Map to different host port
```

### Issue: Build fails with "npm install error"

**Solution**:
```bash
# Clear npm cache and rebuild
docker compose build --no-cache frontend
```

### Issue: Changes not reflecting (Dev Mode)

**Solution**:
```bash
# 1. Ensure using dev compose file
docker compose -f docker-compose.dev.yml up

# 2. Verify volumes are mounted
docker compose -f docker-compose.dev.yml config

# 3. Restart services
docker compose -f docker-compose.dev.yml restart
```

### Issue: "Unhealthy" container status

**Solution**:
```bash
# 1. Check health check logs
docker inspect job-optimizer-backend --format='{{json .State.Health}}'

# 2. Manually test health endpoint
docker compose exec backend curl http://localhost:8000/

# 3. View detailed logs
docker compose logs backend --tail=50
```

---

## Architecture

### Production Architecture (docker-compose.yml)

```
┌─────────────────────────────────────────┐
│          Client Browser                 │
│         http://localhost                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│    NGINX (Frontend Container)            │
│    - Serves React build                  │
│    - Proxies /api → backend:8000        │
│    Port: 80                              │
└──────────────┬───────────────────────────┘
               │
               │ Internal Network (app-network)
               │
               ▼
┌──────────────────────────────────────────┐
│    FastAPI (Backend Container)           │
│    - Multi-Agent System                  │
│    - LangChain + Groq LLM               │
│    Port: 8000                            │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│    External Services                     │
│    - Groq API (LLM)                     │
│    - LangSmith (Tracing)                │
└──────────────────────────────────────────┘
```

### Development Architecture (docker-compose.dev.yml)

```
┌─────────────────────────────────────────┐
│          Client Browser                 │
│       http://localhost:5173             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│    Vite Dev Server (Frontend)            │
│    - Hot Module Replacement              │
│    - Source maps                         │
│    Port: 5173                            │
└──────────────┬───────────────────────────┘
               │
               │ Direct API calls
               │
               ▼
┌──────────────────────────────────────────┐
│    Uvicorn (Backend - Reload Mode)       │
│    - Auto-restart on changes             │
│    - Debug mode enabled                  │
│    Port: 8000                            │
└──────────────────────────────────────────┘
```

### Docker Image Sizes

| Service | Image | Size (approx) |
|---------|-------|---------------|
| Backend | `python:3.11-slim` | ~450 MB |
| Frontend (builder) | `node:20-alpine` | ~180 MB |
| Frontend (production) | `nginx:alpine` | ~45 MB |

---

## Advanced Configuration

### Custom Nginx Configuration

Edit `frontend/nginx.conf` to customize:
- Cache policies
- Security headers
- Proxy settings
- Compression

Then rebuild:
```bash
docker compose build frontend
```

### Multi-Stage Build Optimization

The frontend Dockerfile uses multi-stage builds:
1. **Builder stage**: Installs dependencies and builds React app
2. **Production stage**: Only copies built assets to lightweight Nginx image

This reduces final image size by ~80%.

### Health Checks

Health checks ensure services are ready:

**Backend**:
```yaml
healthcheck:
  test: ["CMD", "python", "-c", "import requests; requests.get('http://localhost:8000/')"]
  interval: 30s
  timeout: 10s
  retries: 3
```

**Frontend**:
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80/"]
  interval: 30s
  timeout: 5s
  retries: 3
```

---

## Production Best Practices

### 1. Use Environment-Specific Files

```bash
# Staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### 2. Enable HTTPS (Production)

Add SSL certificates and update Nginx configuration:

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    # ... rest of config
}
```

### 3. Resource Limits

Add to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 4. Logging Configuration

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 5. Automated Backups

```bash
# Backup script
docker compose exec backend tar czf /tmp/backup.tar.gz /app/data
docker cp job-optimizer-backend:/tmp/backup.tar.gz ./backups/
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build & Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: docker compose build
      
      - name: Run tests
        run: docker compose run backend pytest
      
      - name: Push to registry
        run: |
          docker tag job-optimizer-backend:latest registry.com/backend:latest
          docker push registry.com/backend:latest
```

---

## Support

For Docker-specific issues:
- Check [Docker Documentation](https://docs.docker.com/)
- Review `docker compose logs` output
- Open an issue on GitHub

---

**Happy Containerizing! 🐳**
