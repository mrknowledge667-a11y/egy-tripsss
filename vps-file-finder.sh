#!/bin/bash

# VPS File Finder - Diagnostic Script
# This script helps locate uploaded files on your Hostinger VPS

echo "=== VPS File Upload Diagnostic Script ==="
echo "This script will help you locate uploaded files on your VPS"
echo ""

# Show current user and home directory
echo "1. Current User Information:"
echo "   Username: $(whoami)"
echo "   Home Directory: $HOME"
echo "   Current Directory: $(pwd)"
echo ""

# Show common upload locations
echo "2. Checking common upload locations:"
echo ""

# Check home directory
echo "   a) Home directory ($HOME):"
if [ -d "$HOME" ]; then
    echo "      Recent files (last 24 hours):"
    find "$HOME" -maxdepth 3 -type f -mtime -1 2>/dev/null | head -20
    echo ""
fi

# Check /var/www directories
echo "   b) Web directories (/var/www):"
if [ -d "/var/www" ]; then
    echo "      Contents of /var/www:"
    ls -la /var/www/ 2>/dev/null
    echo ""
    echo "      Checking /var/www/egypttravelpro:"
    if [ -d "/var/www/egypttravelpro" ]; then
        ls -la /var/www/egypttravelpro/ 2>/dev/null | head -10
    else
        echo "      Directory does not exist"
    fi
    echo ""
fi

# Check temporary directories
echo "   c) Temporary directories:"
echo "      /tmp contents (your files):"
ls -la /tmp/ 2>/dev/null | grep "$(whoami)" | head -10
echo ""

# Search for specific file patterns
echo "3. Search for recently uploaded files:"
echo "   Enter a filename or pattern to search (e.g., '*.js', 'package.json'):"
echo "   Press Enter to skip this step"
read -r search_pattern

if [ ! -z "$search_pattern" ]; then
    echo ""
    echo "   Searching for '$search_pattern' in common locations..."
    echo "   Results:"
    find "$HOME" /var/www /tmp -name "$search_pattern" -type f 2>/dev/null | head -20
fi

echo ""
echo "4. Directory permissions check:"
echo "   Checking write permissions for key directories:"
echo ""

# Check permissions
directories=(
    "$HOME"
    "/var/www"
    "/var/www/egypttravelpro"
    "/tmp"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        if [ -w "$dir" ]; then
            echo "   ✓ $dir - Writable"
        else
            echo "   ✗ $dir - Not writable (may need sudo)"
        fi
    else
        echo "   ✗ $dir - Does not exist"
    fi
done

echo ""
echo "5. Recent SSH/SCP activity:"
echo "   Last 10 lines of authentication log (if accessible):"
grep "scp\|sftp" /var/log/auth.log 2>/dev/null | tail -10 || echo "   Cannot access auth logs (need sudo)"

echo ""
echo "=== Recommendations ==="
echo ""
echo "1. When using SCP, always specify the full path:"
echo "   scp -r local_files username@vps_ip:/full/path/to/destination/"
echo ""
echo "2. Common SCP mistakes:"
echo "   - Not specifying destination path (files go to home directory)"
echo "   - Wrong username (files go to different user's home)"
echo "   - Missing trailing slash for directories"
echo ""
echo "3. To upload to /var/www/egypttravelpro, use:"
echo "   scp -r dist/* username@vps_ip:/var/www/egypttravelpro/"
echo "   (You may need to create the directory first with proper permissions)"
echo ""
echo "Script completed!"