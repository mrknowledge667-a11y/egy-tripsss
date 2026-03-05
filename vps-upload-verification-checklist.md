# VPS File Upload Verification Checklist

Use this checklist to ensure your files are uploaded correctly to your Hostinger VPS.

## Pre-Upload Checklist

- [ ] **1. Verify VPS Connection**
  ```bash
  ssh username@vps-ip
  # Should connect without errors
  ```

- [ ] **2. Check Target Directory Exists**
  ```bash
  ls -la /var/www/egypttravelpro
  # If not exists, create it:
  sudo mkdir -p /var/www/egypttravelpro
  sudo chown -R $USER:$USER /var/www/egypttravelpro
  ```

- [ ] **3. Verify Write Permissions**
  ```bash
  touch /var/www/egypttravelpro/test.txt
  rm /var/www/egypttravelpro/test.txt
  # Should complete without errors
  ```

- [ ] **4. Check Available Disk Space**
  ```bash
  df -h /var/www
  # Ensure sufficient space available
  ```

## Upload Process Checklist

- [ ] **5. Use Correct SCP Command Format**
  ```powershell
  # Windows PowerShell format:
  scp -r .\local-folder\* username@vps-ip:/var/www/egypttravelpro/
  
  # Note: Always use:
  # - Full absolute path starting with /
  # - Trailing slash for directories
  # - Correct username and IP
  ```

- [ ] **6. Monitor Upload Progress**
  - Watch for any error messages during upload
  - Note the file count and sizes being transferred
  - Ensure upload completes with "100%" message

## Post-Upload Verification

- [ ] **7. Immediately Check File Presence**
  ```bash
  ssh username@vps-ip
  ls -la /var/www/egypttravelpro/
  ```

- [ ] **8. Verify Critical Files**
  ```bash
  # Check frontend files
  ls -la /var/www/egypttravelpro/dist/index.html
  ls -la /var/www/egypttravelpro/dist/assets/
  
  # Check backend files
  ls -la /var/www/egypttravelpro/server/server.js
  ls -la /var/www/egypttravelpro/package.json
  
  # Check environment file
  ls -la /var/www/egypttravelpro/.env
  ```

- [ ] **9. Verify File Integrity**
  ```bash
  # Check file sizes match local versions
  du -sh /var/www/egypttravelpro/dist
  
  # Check package.json content
  head -20 /var/www/egypttravelpro/package.json
  
  # Count files in dist
  find /var/www/egypttravelpro/dist -type f | wc -l
  ```

- [ ] **10. Check File Ownership**
  ```bash
  ls -la /var/www/egypttravelpro/
  # Files should be owned by your user or www-data
  ```

## If Files Are Missing

- [ ] **11. Check Home Directory**
  ```bash
  ls -la ~/
  ls -la ~/dist/
  ls -la ~/server/
  # Files might be here if path was wrong
  ```

- [ ] **12. Search for Files**
  ```bash
  # Run the diagnostic script
  bash vps-file-finder.sh
  
  # Or search manually
  find /home -name "package.json" 2>/dev/null
  find / -name "index.html" -path "*/dist/*" 2>/dev/null
  ```

- [ ] **13. Check Upload History**
  ```bash
  # Check bash history for upload commands
  history | grep scp
  
  # Check recent file modifications
  find ~ -type f -mmin -30
  ```

## Application Verification

- [ ] **14. Install Dependencies**
  ```bash
  cd /var/www/egypttravelpro
  npm install --production
  ```

- [ ] **15. Start Backend Server**
  ```bash
  pm2 start server/server.js --name egypt-travel-api
  pm2 status
  ```

- [ ] **16. Test Nginx Configuration**
  ```bash
  sudo nginx -t
  sudo systemctl reload nginx
  ```

- [ ] **17. Verify Website Access**
  - Open browser to: http://your-domain.com
  - Check developer console for errors
  - Test API endpoint: http://your-domain.com/api/health

## Common Issues Quick Reference

| Issue | Solution |
|-------|----------|
| Files in home directory | Used relative path or no path in SCP |
| Permission denied | Run: `sudo chown -R $USER:$USER /var/www/egypttravelpro` |
| Files not found anywhere | Check if upload actually completed |
| Partial upload | Check disk space and network connection |
| Wrong user directory | Verify username in SSH/SCP command |

## Quick Recovery Commands

If files are in wrong location:
```bash
# Move from home to correct location
mv ~/dist /var/www/egypttravelpro/
mv ~/server /var/www/egypttravelpro/
mv ~/package*.json /var/www/egypttravelpro/

# Fix permissions after moving
sudo chown -R $USER:$USER /var/www/egypttravelpro
chmod -R 755 /var/www/egypttravelpro
```

## Final Notes

- Always verify uploads immediately
- Keep a local backup of all files
- Document your exact upload commands
- Test the application after each upload

✅ **Success Indicators:**
- All files visible in `/var/www/egypttravelpro`
- Website loads correctly
- API endpoints respond
- No permission errors
- PM2 shows application running