#!/bin/bash

# Simple cron job setup for certificate renewal and backups
# Usage: sudo ./setup.sh

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root: sudo ./setup.sh"
    exit 1
fi

# Get project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPTS_DIR="$PROJECT_DIR/scripts"

# Make scripts executable
chmod +x "$SCRIPTS_DIR/certificates/renew_certs.sh"
chmod +x "$SCRIPTS_DIR/backup/backup.sh"

# Add cronjobs to crontab
(crontab -l 2>/dev/null; echo "# Certificate renewal - Sundays at midnight") | crontab -
(crontab -l; echo "0 0 * * 0 $SCRIPTS_DIR/certificates/renew_certs.sh >> /var/log/cron-cert-renewal.log 2>&1") | crontab -
(crontab -l; echo "# Backup - Daily at 2 AM") | crontab -
(crontab -l; echo "0 2 * * * $SCRIPTS_DIR/backup/backup.sh >> /var/log/cron-backup.log 2>&1") | crontab -

echo "Cronjobs added successfully!"
echo "Certificate renewal: Sundays at midnight"
echo "Backup: Daily at 2 AM"
