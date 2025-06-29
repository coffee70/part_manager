#!/bin/bash

# Cron Job Setup Script
# Sets up automated certificate renewal and backup jobs
# Usage: sudo ./setup.sh

# Get the absolute path to the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPTS_DIR="$PROJECT_DIR/scripts"

# Cron job definitions
CERT_RENEWAL_JOB="0 0 * * 0 $SCRIPTS_DIR/certificates/renew_certs.sh >> /var/log/cron-cert-renewal.log 2>&1"
BACKUP_JOB="0 2 * * * $SCRIPTS_DIR/backup/backup.sh >> /var/log/cron-backup.log 2>&1"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo "ERROR: This script must be run as root (use sudo)"
        echo "Usage: sudo ./setup.sh"
        exit 1
    fi
}

# Function to check if script files exist
check_scripts() {
    local missing_scripts=()
    
    if [ ! -f "$SCRIPTS_DIR/certificates/renew_certs.sh" ]; then
        missing_scripts+=("certificates/renew_certs.sh")
    fi
    
    if [ ! -f "$SCRIPTS_DIR/backup/backup.sh" ]; then
        missing_scripts+=("backup/backup.sh")
    fi
    
    if [ ${#missing_scripts[@]} -gt 0 ]; then
        echo "ERROR: Missing required scripts:"
        for script in "${missing_scripts[@]}"; do
            echo "  - $SCRIPTS_DIR/$script"
        done
        exit 1
    fi
}

# Function to make scripts executable
setup_permissions() {
    log "Setting up script permissions..."
    chmod +x "$SCRIPTS_DIR/certificates/renew_certs.sh"
    chmod +x "$SCRIPTS_DIR/backup/backup.sh"
    log "✓ Script permissions updated"
}

# Function to backup existing crontab
backup_crontab() {
    log "Backing up existing crontab..."
    if crontab -l > /tmp/crontab.backup 2>/dev/null; then
        log "✓ Existing crontab backed up to /tmp/crontab.backup"
    else
        log "No existing crontab found"
    fi
}

# Function to check if cron job already exists
job_exists() {
    local job_pattern="$1"
    crontab -l 2>/dev/null | grep -q "$job_pattern"
}

# Function to add cron jobs
setup_cronjobs() {
    log "Setting up cron jobs..."
    
    # Get current crontab
    local current_crontab=$(crontab -l 2>/dev/null || echo "")
    local new_crontab="$current_crontab"
    
    # Add certificate renewal job if it doesn't exist
    if job_exists "renew_certs.sh"; then
        log "Certificate renewal job already exists, skipping..."
    else
        log "Adding certificate renewal job (Sundays at midnight)..."
        new_crontab="$new_crontab"$'\n'"$CERT_RENEWAL_JOB"
    fi
    
    # Add backup job if it doesn't exist
    if job_exists "backup.sh"; then
        log "Backup job already exists, skipping..."
    else
        log "Adding backup job (daily at 2 AM)..."
        new_crontab="$new_crontab"$'\n'"$BACKUP_JOB"
    fi
    
    # Update crontab
    echo "$new_crontab" | crontab -
    log "✓ Cron jobs configured successfully"
}

# Function to display scheduled jobs
show_jobs() {
    log "Current cron jobs:"
    echo "----------------------------------------"
    crontab -l | grep -E "(renew_certs|backup)" || echo "No relevant jobs found"
    echo "----------------------------------------"
}

# Function to create log directories
setup_logs() {
    log "Setting up log directories..."
    
    # Ensure log files exist and have proper permissions
    touch /var/log/cron-cert-renewal.log
    touch /var/log/cron-backup.log
    chmod 644 /var/log/cron-cert-renewal.log
    chmod 644 /var/log/cron-backup.log
    
    log "✓ Log files created"
}

# Function to test cron service
test_cron_service() {
    log "Checking cron service status..."
    
    if systemctl is-active --quiet cron 2>/dev/null || systemctl is-active --quiet crond 2>/dev/null; then
        log "✓ Cron service is running"
    elif service cron status >/dev/null 2>&1 || service crond status >/dev/null 2>&1; then
        log "✓ Cron service is running"
    else
        log "WARNING: Cron service may not be running"
        log "Try: sudo systemctl start cron"
    fi
}

# Main execution
log "=== Cron Job Setup Starting ==="
log "Project directory: $PROJECT_DIR"
log "Scripts directory: $SCRIPTS_DIR"

# Pre-flight checks
check_root
check_scripts
test_cron_service

# Setup process
backup_crontab
setup_permissions
setup_logs
setup_cronjobs

# Display results
show_jobs

log "=== Cron Job Setup Completed ==="
log ""
log "Scheduled jobs:"
log "  • Certificate renewal: Sundays at midnight (00:00)"
log "  • Backup: Daily at 2 AM (02:00)"
log ""
log "Log files:"
log "  • Certificate renewal: /var/log/cron-cert-renewal.log"
log "  • Backup: /var/log/cron-backup.log"
log ""
log "To remove these jobs later, run: crontab -e"

exit 0
