#!/bin/bash

# Master backup script - runs database dump and uploads to Google Drive
# Usage: ./backup.sh
# Suitable for cron jobs

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$(dirname "$SCRIPT_DIR")")")"
LOG_FILE="/tmp/backup_$(date +"%Y%m%d_%H%M%S").log"

# Function to log messages with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to log errors and exit
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Start backup process
log "=== Starting backup process ==="
log "Script directory: $SCRIPT_DIR"
log "Application root directory: $ROOT_DIR"
log "Log file: $LOG_FILE"

# Check if required files exist
if [ ! -f "$SCRIPT_DIR/dump_db.sh" ]; then
    error_exit "dump_db.sh not found in $SCRIPT_DIR"
fi

if [ ! -f "$SCRIPT_DIR/upload-googledrive.js" ]; then
    error_exit "upload-googledrive.js not found in $SCRIPT_DIR"
fi

if [ ! -f "$ROOT_DIR/.env" ]; then
    error_exit ".env file not found in application root directory - Google Drive credentials required"
fi

# Step 1: Create database and files backup
log "Step 1: Creating database and files backup..."
cd "$SCRIPT_DIR"
if ! ./dump_db.sh >> "$LOG_FILE" 2>&1; then
    error_exit "Database backup failed - check Docker containers are running"
fi
log "✓ Database backup completed successfully"

# Step 2: Upload to Google Drive
log "Step 2: Uploading backup to Google Drive..."
if ! node upload-googledrive.js >> "$LOG_FILE" 2>&1; then
    error_exit "Google Drive upload failed - check .env credentials and service account permissions"
fi
log "✓ Google Drive upload completed successfully"

# Cleanup old log files (keep last 7 days)
log "Cleaning up old log files..."
find /tmp -name "backup_*.log" -type f -mtime +7 -delete 2>/dev/null || true

log "=== Backup process completed successfully ==="
log "Full log available at: $LOG_FILE"

# Optional: Clean up old backups (uncomment to keep only last 5 backups)
# log "Cleaning up old backup files..."
# ls -t ~/backups/*.tgz | tail -n +6 | xargs -r rm -f

echo "Backup completed successfully! Check $LOG_FILE for details." 