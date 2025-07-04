#!/bin/bash

# Restore script for MongoDB and file-service files
# Usage: ./restore_db.sh [backup_file_path] [--no-confirm] [--no-restart-prompt]
# If no backup file is provided, it will look for the latest .tgz file in ~/backups

# Function to log messages with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to log errors and exit
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Function to cleanup temporary files
cleanup() {
    if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        log "Cleaning up temporary files..."
        rm -rf "$TEMP_DIR"
    fi
}

# Set up cleanup trap
trap cleanup EXIT

# Parse arguments
BACKUP_FILE="$1"
NO_CONFIRM=false
NO_RESTART_PROMPT=false
BACKUP_DIR="$HOME/backups"

# Parse optional flags
for arg in "$@"; do
    case $arg in
        --no-confirm)
            NO_CONFIRM=true
            shift
            ;;
        --no-restart-prompt)
            NO_RESTART_PROMPT=true
            shift
            ;;
    esac
done

if [ -z "$BACKUP_FILE" ]; then
    log "No backup file specified, looking for latest backup in $BACKUP_DIR..."
    
    if [ ! -d "$BACKUP_DIR" ]; then
        error_exit "Backup directory $BACKUP_DIR does not exist"
    fi
    
    # Find the latest .tgz file
    BACKUP_FILE=$(ls -t "$BACKUP_DIR"/*.tgz 2>/dev/null | head -n 1)
    
    if [ -z "$BACKUP_FILE" ]; then
        error_exit "No backup files found in $BACKUP_DIR"
    fi
    
    log "Found latest backup: $BACKUP_FILE"
else
    log "Using specified backup file: $BACKUP_FILE"
fi

# Verify backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    error_exit "Backup file does not exist: $BACKUP_FILE"
fi

# Create temporary directory for extraction
TEMP_DIR="/tmp/restore_$(date +"%Y%m%d_%H%M%S")"
mkdir -p "$TEMP_DIR"
log "Created temporary directory: $TEMP_DIR"

# Extract backup file
log "Extracting backup file..."
if ! tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"; then
    error_exit "Failed to extract backup file"
fi

# Verify extracted contents
if [ ! -d "$TEMP_DIR/mongodump" ]; then
    error_exit "MongoDB backup data not found in extracted files"
fi

if [ ! -d "$TEMP_DIR/uploads" ]; then
    log "WARNING: File uploads data not found in extracted files"
    HAS_UPLOADS=false
else
    HAS_UPLOADS=true
fi

# Check if Docker containers are running
log "Checking Docker containers..."
if ! docker ps | grep -q "mongo"; then
    error_exit "MongoDB container 'mongo' is not running"
fi

if [ "$HAS_UPLOADS" = true ] && ! docker ps | grep -q "file-service"; then
    error_exit "File-service container 'file-service' is not running"
fi

# Ask for confirmation before proceeding (unless --no-confirm flag is used)
if [ "$NO_CONFIRM" = false ]; then
    read -p "This will REPLACE all current data in MongoDB and file-service. Are you sure? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log "Restore cancelled by user"
        exit 0
    fi
else
    log "Skipping confirmation prompt (--no-confirm flag used)"
fi

# Restore MongoDB database
log "Starting MongoDB restore..."

# First, clear existing data (optional - comment out if you want to merge data)
log "Clearing existing MongoDB data..."
docker exec mongo mongo --eval "
    db.adminCommand('listCollections').cursor.firstBatch.forEach(
        function(collection) {
            if (collection.name !== 'system.indexes') {
                db[collection.name].drop();
            }
        }
    );
"

# Copy dump data to container
log "Copying MongoDB dump to container..."
docker cp "$TEMP_DIR/mongodump" mongo:/tmp/mongodump

# Restore from dump
log "Restoring MongoDB data..."
if ! docker exec mongo mongorestore --drop /tmp/mongodump; then
    error_exit "MongoDB restore failed"
fi

# Clean up MongoDB temp files in container
log "Cleaning up temporary MongoDB files in container..."
docker exec mongo rm -rf /tmp/mongodump

log "✓ MongoDB restore completed successfully"

# Restore file uploads if they exist
if [ "$HAS_UPLOADS" = true ]; then
    log "Starting file uploads restore..."
    
    # Backup existing uploads (optional)
    BACKUP_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    log "Backing up existing uploads to uploads_backup_$BACKUP_TIMESTAMP..."
    docker exec file-service mv /app/uploads "/app/uploads_backup_$BACKUP_TIMESTAMP" 2>/dev/null || true
    
    # Create uploads directory in container
    docker exec file-service mkdir -p /app/uploads
    
    # Copy restored uploads to container
    log "Copying file uploads to container..."
    docker cp "$TEMP_DIR/uploads/." file-service:/app/uploads/
    
    # Set proper permissions
    log "Setting proper permissions on uploads..."
    docker exec file-service chown -R $(docker exec file-service whoami):$(docker exec file-service whoami) /app/uploads 2>/dev/null || true
    
    log "✓ File uploads restore completed successfully"
else
    log "ℹ No file uploads data to restore"
fi

# Verify restore
log "Verifying restore..."

# Check MongoDB collections
COLLECTIONS=$(docker exec mongo mongo --quiet --eval "db.adminCommand('listCollections').cursor.firstBatch.length")
log "MongoDB collections found: $COLLECTIONS"

# Check file uploads
if [ "$HAS_UPLOADS" = true ]; then
    UPLOAD_COUNT=$(docker exec file-service find /app/uploads -type f | wc -l)
    log "Upload files found: $UPLOAD_COUNT"
fi

log "=== Restore completed successfully ==="
log "Backup file used: $BACKUP_FILE"
log "Temporary files cleaned up: $TEMP_DIR"

# Optional: Restart services to ensure clean state
if [ "$NO_RESTART_PROMPT" = false ]; then
    read -p "Do you want to restart the Docker containers to ensure clean state? (y/n): " -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Restarting Docker containers..."
        
        if [ "$HAS_UPLOADS" = true ]; then
            docker restart file-service
            log "✓ Restarted file-service container"
        fi
        
        docker restart mongo
        log "✓ Restarted mongo container"
        
        log "✓ All containers restarted successfully"
    fi
else
    log "Skipping container restart prompt (--no-restart-prompt flag used)"
fi

log "Restore process completed!" 