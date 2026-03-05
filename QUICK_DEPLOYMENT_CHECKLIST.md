# Quick Deployment Checklist for Hostinger VPS

## Files Ready on Your Local Machine:
✅ React app built successfully (dist/ folder created)
✅ .env.production template created
✅ Full deployment guide available in HOSTINGER_VPS_DEPLOYMENT.md

## Quick Steps to Deploy:

### 1. Connect to your VPS:
```bash
ssh your-username@your-vps-ip
```

### 2. Quick Setup Commands (run on VPS):
```bash
# Check Node.js
node -v

# If not installed:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 and Nginx
sudo npm install -g pm2
sudo apt install nginx -y

# Create app directory
sudo mkdir -p /var/www/egypttravelpro
sudo chown $USER:$USER /var/www/egypttravelpro
```

### 3. Upload Files (from local machine):
```bash
# From your project directory (ffmd)
scp -r dist/ server/ package*.json .env.production your-username@your-vps-ip:/var/www/egypttravelpro/
```

### 4. On VPS - Install & Run:
```bash
cd /var/www/egypttravelpro
mv .env.production .env
nano .env  # Add your actual API keys
npm install --production
pm2 start server/server.js --name egypt-travel-api
```

### 5. Configure Nginx (see full guide for complete config)

### 6. Get SSL Certificate:
```bash
sudo certbot --nginx -d yourdomain.com
```

## Important Files in Your Project:
- **Frontend Build**: `dist/` (2.6MB built app)
- **Backend Server**: `server/server.js`
- **Environment Config**: `.env.production` (rename to .env on server)

## Need Help?
- Full guide: HOSTINGER_VPS_DEPLOYMENT.md
- Test endpoints:
  - Frontend: https://yourdomain.com
  - API Health: https://yourdomain.com/api/health

## Common Issues:
1. **Build errors**: Run `npm run build` locally first
2. **Port conflicts**: Ensure port 3001 is free
3. **CORS errors**: Update CLIENT_URL in .env
4. **404 errors**: Check Nginx try_files configuration

Remember to replace:
- `your-username` with your VPS username
- `your-vps-ip` with your actual VPS IP
- `yourdomain.com` with your actual domain