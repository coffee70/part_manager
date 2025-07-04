#!/bin/bash

# Create timestamp for backup directory
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$HOME/backups"
TEMP_DIR="/tmp/backup_$TIMESTAMP"

# Create backup and temporary directories
mkdir -p "$BACKUP_DIR"
mkdir -p "$TEMP_DIR"

# Run mongodump inside the mongo container
echo "Starting MongoDB backup..."
docker exec mongo mongodump --out /tmp/mongodump

# Copy the dump from container to temp directory
echo "Copying MongoDB backup files..."
docker cp mongo:/tmp/mongodump "$TEMP_DIR/mongodump"

# Clean up temporary MongoDB files in container
echo "Cleaning up temporary MongoDB files..."
docker exec mongo rm -rf /tmp/mongodump

# Copy uploaded files from file-service container to temp directory
echo "Starting file uploads backup..."
docker cp file-service:/app/uploads "$TEMP_DIR/uploads"

# Create gzipped tarball
echo "Creating tarball..."
cd "$TEMP_DIR"
tar -czf "$BACKUP_DIR/$TIMESTAMP.tgz" mongodump uploads

# Clean up temporary directory
echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo "Backup completed successfully: $BACKUP_DIR/$TIMESTAMP.tgz"
