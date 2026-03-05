# Docker Setup Guide for Egypt Travel Pro

This guide explains how to run the Egypt Travel Pro application using Docker and Docker Compose.

## Architecture

The application consists of three main services:
1. **Client** - Vite/React frontend served by Nginx
2. **API** - Node.js Express backend server
3. **Nginx Proxy Manager** - Reverse proxy and SSL management

## Prerequisites

- Docker Engine 20.10.0 or higher
- Docker Compose 2.0.0 or higher
- `.env.production` file with all required environment variables
- Node.js 20+ (required for Supabase client compatibility)

## Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up -d --build
   ```

2. **Access the applications:**
   - Frontend (direct): http://localhost:5421
   - API: http://localhost:3001
   - Nginx Proxy Manager Admin: http://localhost:81

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

## Service Details

### Client Service (Frontend)
- Built using multi-stage Dockerfile
- Serves static files via Nginx
- Accessible through Nginx Proxy Manager on port 8080 (or 80 if available)

### API Service (Backend)
- Runs Node.js Express server
- Exposed on port 3001
- Configured with production environment variables

### Nginx Proxy Manager
- Admin interface on port 81
- Default credentials (first-time setup):
  - Email: admin@example.com
  - Password: changeme
- Handles SSL certificates via Let's Encrypt
- Manages reverse proxy rules

## Networking

All services communicate through the `egy-trips-network` bridge network:
- Client connects to API via internal Docker network
- Nginx Proxy Manager routes external traffic to services
- No direct external access to client container

## Environment Variables

Create `.env.production` file with:
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Paymob Configuration
PAYMOB_API_KEY=...
PAYMOB_INTEGRATION_ID=...
PAYMOB_IFRAME_ID=...
PAYMOB_HMAC_SECRET=...

# Supabase Configuration
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...

# Server Configuration
SERVER_PORT=3001
CLIENT_URL=http://localhost
```

## Domain Setup with Nginx Proxy Manager

### First Time Setup
1. Access NPM admin panel at http://localhost:81
2. Default credentials:
   - Email: admin@example.com
   - Password: changeme
3. Change admin credentials immediately

### Configure Domain Routing
1. Go to "Hosts" → "Proxy Hosts" → "Add Proxy Host"
2. Configure the proxy:
   - **Domain Names**: your-domain.com (and www.your-domain.com)
   - **Scheme**: http
   - **Forward Hostname/IP**: client (Docker service name)
   - **Forward Port**: 80
   - **Block Common Exploits**: ✓ Enabled
   - **Websockets Support**: ✓ Enabled (if needed)

3. Save and test your domain

### SSL Certificate Setup
1. Edit your proxy host
2. Go to SSL tab:
   - **SSL Certificate**: Request a new SSL Certificate
   - **Force SSL**: ✓ Enabled
   - **HTTP/2 Support**: ✓ Enabled
   - **HSTS Enabled**: ✓ Enabled (recommended)
   - **HSTS Subdomains**: ✓ Enabled (if using subdomains)
   - Email: your-email@example.com
   - Agree to Let's Encrypt Terms
3. Save - NPM will automatically obtain and configure SSL

### API Routing (Optional)
To route API through the same domain:
1. Add another Proxy Host:
   - **Domain Names**: api.your-domain.com
   - **Forward Hostname/IP**: api
   - **Forward Port**: 3001
   - Configure SSL as above

Or use location-based routing:
1. Edit main domain proxy host
2. Go to "Custom Locations" tab
3. Add location:
   - **Location**: /api
   - **Forward Hostname/IP**: api
   - **Forward Port**: 3001

## Production Deployment

### Using Docker Compose
```bash
# Pull latest changes
git pull

# Rebuild and restart services
docker-compose up -d --build

# Remove old images
docker image prune -f
```

### Backup Data
```bash
# Backup Nginx Proxy Manager data
tar -czf npm-backup.tar.gz data/ letsencrypt/

# Backup environment file
cp .env.production .env.production.backup
```

### Monitoring
```bash
# Check service status
docker-compose ps

# Monitor resource usage
docker stats

# Check service health
docker-compose exec api node -e "console.log('API is running')"
docker-compose exec client nginx -t
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs [service-name]

# Rebuild specific service
docker-compose build --no-cache [service-name]
```

### Network issues
```bash
# Inspect network
docker network inspect egy-trips_egy-trips-network

# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

### Permission issues
```bash
# Fix volume permissions
sudo chown -R $USER:$USER data/ letsencrypt/
```

## Development Mode

For development with hot reload:
```bash
# Run services in development mode
docker-compose -f docker-compose.dev.yml up
```

Note: You'll need to create `docker-compose.dev.yml` with appropriate volume mounts for development.