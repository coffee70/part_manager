#!/bin/bash

# Master restore script - downloads latest backup from Google Drive and restores database and files
# Usage: ./restore.sh [backup_file_path]
# If no backup file is provided, it will download the latest backup from Google Drive
# Suitable for disaster recovery scenarios

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$(dirname "$SCRIPT_DIR")")")"
LOG_FILE="/tmp/restore_$(date +"%Y%m%d_%H%M%S").log"

# Function to log messages with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to log errors and exit
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Start restore process
log "=== Starting restore process ==="
log "Script directory: $SCRIPT_DIR"
log "Application root directory: $ROOT_DIR"
log "Log file: $LOG_FILE"

# Check if specific backup file was provided
BACKUP_FILE="$1"

if [ -n "$BACKUP_FILE" ]; then
    log "Using specified backup file: $BACKUP_FILE"
    
    # Verify the backup file exists
    if [ ! -f "$BACKUP_FILE" ]; then
        error_exit "Specified backup file does not exist: $BACKUP_FILE"
    fi
    
    # Skip download step and go directly to restore
    log "Skipping download, proceeding directly to restore..."
else
    log "No backup file specified, will download latest from Google Drive..."
    
    # Check if required files exist
    if [ ! -f "$SCRIPT_DIR/download-googledrive.js" ]; then
        error_exit "download-googledrive.js not found in $SCRIPT_DIR"
    fi

    if [ ! -f "$ROOT_DIR/.env" ]; then
        error_exit ".env file not found in application root directory - Google Drive credentials required"
    fi

    # Step 1: Download latest backup from Google Drive
    log "Step 1: Downloading latest backup from Google Drive..."
    cd "$SCRIPT_DIR"
    
    # Capture the download output to get the file path
    DOWNLOAD_OUTPUT=$(node download-googledrive.js 2>&1)
    DOWNLOAD_EXIT_CODE=$?
    
    # Log the download output
    echo "$DOWNLOAD_OUTPUT" >> "$LOG_FILE"
    
    if [ $DOWNLOAD_EXIT_CODE -ne 0 ]; then
        error_exit "Google Drive download failed - check .env credentials and service account permissions"
    fi
    
    # Extract the download path from the output
    BACKUP_FILE=$(echo "$DOWNLOAD_OUTPUT" | grep "DOWNLOAD_PATH=" | cut -d'=' -f2)
    
    if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
        error_exit "Failed to determine downloaded backup file path"
    fi
    
    log "✓ Google Drive download completed successfully"
    log "Downloaded backup file: $BACKUP_FILE"
fi

# Check if restore script exists
if [ ! -f "$SCRIPT_DIR/restore_db.sh" ]; then
    error_exit "restore_db.sh not found in $SCRIPT_DIR"
fi

# Step 2: Confirm restore operation
echo ""
echo "RESTORE CONFIRMATION:"
echo "This will REPLACE all current data in MongoDB and file-service containers."
echo "Backup file: $BACKUP_FILE"
echo ""
read -p "Are you sure you want to proceed? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    log "Restore cancelled by user"
    echo "Restore cancelled."
    exit 0
fi

echo ""
read -p "Do you want to restart Docker containers after restore for clean state? (y/n): " -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
    RESTART_CONTAINERS=true
else
    RESTART_CONTAINERS=false
fi

# Step 3: Restore database and files
log "Step 3: Restoring database and files from backup..."

# Make sure restore script is executable
chmod +x "$SCRIPT_DIR/restore_db.sh"

# Prepare flags for restore script
RESTORE_FLAGS="--no-confirm"
if [ "$RESTART_CONTAINERS" = false ]; then
    RESTORE_FLAGS="$RESTORE_FLAGS --no-restart-prompt"
fi

# Run the restore script with the backup file and flags
if ! "$SCRIPT_DIR/restore_db.sh" "$BACKUP_FILE" $RESTORE_FLAGS >> "$LOG_FILE" 2>&1; then
    error_exit "Database and files restore failed - check Docker containers are running"
fi

# Handle container restart if user requested it
if [ "$RESTART_CONTAINERS" = true ]; then
    log "Restarting Docker containers as requested..."
    echo "Restarting Docker containers..."
    
    # Check which containers exist and restart them
    if docker ps -a --format "{{.Names}}" | grep -q "file-service"; then
        docker restart file-service
        log "✓ Restarted file-service container"
        echo "✓ Restarted file-service container"
    fi
    
    if docker ps -a --format "{{.Names}}" | grep -q "mongo"; then
        docker restart mongo
        log "✓ Restarted mongo container"
        echo "✓ Restarted mongo container"
    fi
    
    echo "✓ Container restart completed"
fi

log "✓ Database and files restore completed successfully"

# Cleanup old log files (keep last 7 days)
log "Cleaning up old log files..."
find /tmp -name "restore_*.log" -type f -mtime +7 -delete 2>/dev/null || true

log "=== Restore process completed successfully ==="
log "Restored from backup: $BACKUP_FILE"
log "Full log available at: $LOG_FILE"

echo "Restore completed successfully! Check $LOG_FILE for details."
echo ""
echo "IMPORTANT: Please verify that your application is working correctly:"
echo "  1. Check that all expected data is present"
echo "  2. Test critical functionality"
echo "  3. Verify file uploads are accessible"
echo "  4. Consider restarting your application services if needed" 