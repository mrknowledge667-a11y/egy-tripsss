# Understanding Directory Locations

## Current Locations:

### 1. Your LOCAL Windows Machine (where you are now):
- **Your project**: `C:\Users\delta\OneDrive\Desktop\ffmpeg\ffmpeg-8.0.1-essentials_build\presets\ffmd`
- **Built files**: `C:\Users\delta\OneDrive\Desktop\ffmpeg\ffmpeg-8.0.1-essentials_build\presets\ffmd\dist`
- This is where you've been working and where your files currently are

### 2. Your REMOTE Hostinger VPS Server:
- **Target directory**: `/var/www/egypttravelpro` (needs to be created)
- This is a Linux path on your VPS server
- You'll access this through SSH

## How to Create the Directory on Your VPS:

### Step 1: Connect to your Hostinger VPS
Open a new terminal/PowerShell window and connect via SSH:
```bash
ssh your-username@your-vps-ip
```
Example:
```bash
ssh root@123.456.789.10
```

### Step 2: Once Connected to VPS, Create the Directory
```bash
# You are now on the VPS Linux server
# Create the directory
sudo mkdir -p /var/www/egypttravelpro

# Give yourself ownership
sudo chown $USER:$USER /var/www/egypttravelpro

# Navigate to it
cd /var/pttravelprowww/egy

# Check you're in the right place
pwd
# Should output: /var/www/egypttravelpro
```

## Directory Structure Explained:

On Linux/VPS servers:
- `/` = Root directory
- `/var` = Variable data directory (standard location)
- `/var/www` = Standard web server directory
- `/var/www/egypttravelpro` = Your app's directory (you create this)

## Two Ways to Get Your Files There:

### Option 1: Upload from your Windows machine
From your LOCAL PowerShell (NOT the SSH session):
```powershell
# Navigate to your project directory first
cd C:\Users\delta\OneDrive\Desktop\ffmpeg\ffmpeg-8.0.1-essentials_build\presets\ffmd

# Then upload files
scp -r dist server package*.json .env.production your-username@your-vps-ip:/var/www/egypttravelpro/
```

### Option 2: Use VS Code Remote SSH
1. In VS Code, connect to your VPS using Remote-SSH extension
2. Open folder: `/var/www/egypttravelpro`
3. Drag and drop files from your local machine to VS Code

## Quick Check - Am I on Local or VPS?

In your terminal, run:
```bash
hostname
```
- If it shows your Windows computer name = You're LOCAL
- If it shows your VPS hostname = You're on the VPS

Or check the prompt:
- `PS C:\Users\delta>` = Windows PowerShell (LOCAL)
- `username@vps-hostname:~$` = Linux/VPS (REMOTE)

## Summary:
1. `/var/www/egypttravelpro` is a directory you CREATE on your VPS
2. It doesn't exist on your Windows machine
3. You need to SSH into your VPS first, then create it
4. After creating it, you upload your files from Windows to VPS