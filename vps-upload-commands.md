# VPS File Upload Commands - Complete Guide

## Understanding the Problem
When files upload successfully but can't be found, it's usually because:
1. Files are uploaded to the home directory instead of the intended location
2. Using relative paths that resolve differently than expected
3. Missing the destination path entirely (defaults to home directory)

## Correct SCP Commands for Your Egypt Travel Pro Project

### 1. First, Run the Diagnostic Script on Your VPS
```bash
# SSH into your VPS first
ssh your-username@your-vps-ip

# Run the diagnostic script to find your files
bash vps-file-finder.sh
```

### 2. Proper SCP Upload Commands

#### For Windows (PowerShell) - Upload Individual Files:
```powershell
# Upload the built frontend (dist folder)
scp -r .\dist\* username@vps-ip:/var/www/egypttravelpro/dist/

# Upload backend files
scp -r .\server\* username@vps-ip:/var/www/egypttravelpro/server/

# Upload package files
scp .\package.json username@vps-ip:/var/www/egypttravelpro/
scp .\package-lock.json username@vps-ip:/var/www/egypttravelpro/

# Upload environment file
scp .\.env.production username@vps-ip:/var/www/egypttravelpro/.env
```

#### For Windows (PowerShell) - Upload Everything at Once:
```powershell
# Create a temporary upload folder
New-Item -ItemType Directory -Force -Path .\upload-temp

# Copy files to upload (excluding node_modules)
Copy-Item -Path .\dist -Destination .\upload-temp\ -Recurse
Copy-Item -Path .\server -Destination .\upload-temp\ -Recurse
Copy-Item -Path .\src -Destination .\upload-temp\ -Recurse
Copy-Item -Path .\public -Destination .\upload-temp\ -Recurse
Copy-Item -Path .\package*.json -Destination .\upload-temp\
Copy-Item -Path .\.env.production -Destination .\upload-temp\.env

# Upload everything
scp -r .\upload-temp\* username@vps-ip:/var/www/egypttravelpro/

# Clean up
Remove-Item -Recurse -Force .\upload-temp
```

### 3. Common Issues and Solutions

#### Issue: "Permission denied" when uploading to /var/www/egypttravelpro
```bash
# SSH into VPS first, then:
# Create directory with proper permissions
sudo mkdir -p /var/www/egypttravelpro
sudo chown -R $USER:$USER /var/www/egypttravelpro
sudo chmod -R 755 /var/www/egypttravelpro
```

#### Issue: Files end up in home directory
This happens when you use these incorrect commands:
```powershell
# WRONG - Missing destination path
scp -r .\dist\* username@vps-ip

# WRONG - Relative path
scp -r .\dist\* username@vps-ip:egypttravelpro/

# CORRECT - Full absolute path
scp -r .\dist\* username@vps-ip:/var/www/egypttravelpro/dist/
```

### 4. Alternative: Upload to Home First, Then Move
If you're having permission issues with /var/www, try this approach:

```powershell
# Step 1: Upload to home directory
scp -r .\dist username@vps-ip:~/
scp -r .\server username@vps-ip:~/
scp .\package*.json username@vps-ip:~/
scp .\.env.production username@vps-ip:~/.env
```

Then SSH into VPS and move files:
```bash
# Step 2: SSH into VPS
ssh username@vps-ip

# Step 3: Create destination and move files
sudo mkdir -p /var/www/egypttravelpro
sudo chown -R $USER:$USER /var/www/egypttravelpro

# Move files from home to destination
mv ~/dist /var/www/egypttravelpro/
mv ~/server /var/www/egypttravelpro/
mv ~/package*.json /var/www/egypttravelpro/
mv ~/.env /var/www/egypttravelpro/
```

### 5. Using VS Code Remote SSH

If using VS Code Remote SSH extension:
1. Connect to VPS: `Ctrl+Shift+P` → "Remote-SSH: Connect to Host"
2. Open folder: `/var/www/egypttravelpro`
3. If folder doesn't exist or no permissions:
   ```bash
   sudo mkdir -p /var/www/egypttravelpro
   sudo chown -R $USER:$USER /var/www/egypttravelpro
   ```
4. Drag and drop files into VS Code explorer

### 6. Verify Upload Success

After uploading, always verify:
```bash
# Check if files are in the correct location
ls -la /var/www/egypttravelpro/
ls -la /var/www/egypttravelpro/dist/
ls -la /var/www/egypttravelpro/server/

# Check file sizes to ensure complete upload
du -sh /var/www/egypttravelpro/*

# Check specific important files
cat /var/www/egypttravelpro/package.json
ls -la /var/www/egypttravelpro/.env
```

### 7. Quick Troubleshooting Commands

```bash
# Find all recently modified files (last hour)
find / -type f -mmin -60 2>/dev/null | grep -v /proc | grep -v /sys

# Find files by name pattern
find / -name "package.json" 2>/dev/null

# Check your home directory
ls -la ~/

# Check common upload locations
ls -la /tmp/
ls -la /var/tmp/
ls -la /home/
```

## Remember:
- Always use ABSOLUTE paths starting with `/`
- Include the trailing slash for directories
- Verify destination directory exists and has proper permissions
- Check file locations immediately after upload