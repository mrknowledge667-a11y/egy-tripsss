# Docker Setup Troubleshooting Guide

## Issue 1: Domain Shows Apache Page Instead of Your App

### Problem
- Direct access via IP:5421 works correctly
- Domain access shows Apache default page
- Nginx Proxy Manager is configured but not receiving requests

### Root Cause
Apache is running on the host system and listening on ports 80/443, intercepting all domain requests before they reach Nginx Proxy Manager.

### Solutions

#### Option 1: Stop Apache and Use Standard Ports (Recommended)
```bash
# Stop Apache service
sudo systemctl stop apache2
sudo systemctl disable apache2

# Update docker-compose.yml to use standard ports
# Change NPM ports back to:
# - '80:80'
# - '443:443'

# Restart containers
docker-compose down
docker-compose up -d
```

#### Option 2: Configure Apache as Reverse Proxy
If you need Apache for other sites, configure it to proxy your domain to NPM:

1. Create Apache virtual host:
```bash
sudo nano /etc/apache2/sites-available/your-domain.conf
```

2. Add configuration:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:8080/
    ProxyPassReverse / http://localhost:8080/
    
    # For SSL verification
    ProxyPass /.well-known/acme-challenge/ http://localhost:8080/.well-known/acme-challenge/
    ProxyPassReverse /.well-known/acme-challenge/ http://localhost:8080/.well-known/acme-challenge/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    
    SSLEngine on
    SSLProxyEngine on
    
    ProxyPreserveHost On
    ProxyPass / https://localhost:8443/
    ProxyPassReverse / https://localhost:8443/
</VirtualHost>
```

3. Enable the site and required modules:
```bash
sudo a2enmod proxy proxy_http ssl
sudo a2ensite your-domain
sudo systemctl reload apache2
```

#### Option 3: Use Different Ports for Everything
Keep Apache on 80/443 and access your app via non-standard ports:
- Access site via: https://your-domain.com:8080
- Configure SSL in NPM for port 8443

## Issue 2: SSL Certificate Fails in Nginx Proxy Manager

### Problem
- Let's Encrypt validation fails
- DNS is correctly configured with A records
- Error during certificate request

### Root Cause
Let's Encrypt needs to validate domain ownership via HTTP challenge on port 80, but Apache is intercepting these requests.

### Solutions

#### If Using Option 1 (Apache Stopped)
SSL should work immediately after stopping Apache and using standard ports.

#### If Using Option 2 (Apache as Proxy)
Ensure Apache properly forwards ACME challenges:
```bash
# Test ACME challenge path
curl http://your-domain.com/.well-known/acme-challenge/test
```

#### Alternative SSL Methods

1. **DNS Challenge** (if supported by your DNS provider):
   - In NPM, use DNS challenge instead of HTTP
   - Add TXT records as requested

2. **Manual Certificate**:
   ```bash
   # Use certbot directly
   sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com --http-01-port=8080
   ```

3. **Use Cloudflare** (if available):
   - Set up Cloudflare proxy
   - Use Cloudflare's SSL/TLS
   - Set NPM to HTTP only (Cloudflare handles SSL)

## Quick Diagnostics

### Check What's Using Ports
```bash
# Check port 80
sudo lsof -i :80
sudo netstat -tlnp | grep :80

# Check port 443
sudo lsof -i :443
sudo netstat -tlnp | grep :443

# Check Docker ports
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

### Test Domain Resolution
```bash
# Check DNS
nslookup your-domain.com
dig your-domain.com

# Test connectivity
curl -I http://your-domain.com
curl -I http://your-domain.com:5421
curl -I http://your-domain.com:8080
```

### Check Nginx Proxy Manager Logs
```bash
# NPM logs
docker logs egy-trips-nginx-proxy

# Check SSL certificate logs
docker exec egy-trips-nginx-proxy cat /data/logs/letsencrypt-requests.log
```

## Recommended Setup for Production

1. **Stop conflicting services**:
   ```bash
   sudo systemctl stop apache2
   sudo systemctl disable apache2
   ```

2. **Update docker-compose.yml**:
   ```yaml
   app:
     ports:
       - '80:80'    # Standard HTTP
       - '443:443'  # Standard HTTPS
       - '81:81'    # Admin panel
   ```

3. **Restart everything**:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

4. **Configure in NPM**:
   - Domain: your-domain.com, www.your-domain.com
   - Forward to: client:80
   - Enable SSL with Let's Encrypt

## Advanced: Using Traefik Instead

If NPM continues to have issues, consider Traefik as an alternative:

```yaml
# docker-compose.yml addition
traefik:
  image: traefik:v2.10
  command:
    - "--api.insecure=true"
    - "--providers.docker=true"
    - "--entrypoints.web.address=:80"
    - "--entrypoints.websecure.address=:443"
    - "--certificatesresolvers.myresolver.acme.httpchallenge=true"
    - "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web"
    - "--certificatesresolvers.myresolver.acme.email=your-email@example.com"
    - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
  ports:
    - "80:80"
    - "443:443"
    - "8080:8080"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - ./letsencrypt:/letsencrypt
  labels:
    - "traefik.http.routers.api.rule=Host(`traefik.your-domain.com`)"
    - "traefik.http.routers.api.service=api@internal"

client:
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.client.rule=Host(`your-domain.com`,`www.your-domain.com`)"
    - "traefik.http.routers.client.entrypoints=websecure"
    - "traefik.http.routers.client.tls.certresolver=myresolver"