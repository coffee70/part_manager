#!/bin/bash

# SSL Certificate Renewal Script
# Usage: ./renew_certs.sh
# Suitable for cron jobs - stops nginx, renews certificates, restarts nginx

# Configuration
LOG_FILE="/var/log/certbot-renewal.log"
NGINX_SERVICE="nginx"
CERTBOT_CMD="certbot renew"

# Function to log messages with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to log errors and exit
error_exit() {
    log "ERROR: $1"
    log "Attempting to start nginx..."
    systemctl start "$NGINX_SERVICE" 2>/dev/null || service "$NGINX_SERVICE" start 2>/dev/null
    exit 1
}

# Function to check if nginx is running
is_nginx_running() {
    systemctl is-active --quiet "$NGINX_SERVICE" 2>/dev/null || service "$NGINX_SERVICE" status >/dev/null 2>&1
}

# Function to stop nginx
stop_nginx() {
    log "Stopping nginx..."
    if systemctl stop "$NGINX_SERVICE" 2>/dev/null || service "$NGINX_SERVICE" stop 2>/dev/null; then
        log "✓ Nginx stopped successfully"
        return 0
    else
        log "WARNING: Failed to stop nginx gracefully"
        return 1
    fi
}

# Function to start nginx
start_nginx() {
    log "Starting nginx..."
    if systemctl start "$NGINX_SERVICE" 2>/dev/null || service "$NGINX_SERVICE" start 2>/dev/null; then
        log "✓ Nginx started successfully"
        return 0
    else
        error_exit "Failed to start nginx"
    fi
}

# Function to test nginx configuration
test_nginx_config() {
    log "Testing nginx configuration..."
    if nginx -t 2>/dev/null; then
        log "✓ Nginx configuration is valid"
        return 0
    else
        log "ERROR: Nginx configuration test failed"
        return 1
    fi
}

# Function to reload nginx (graceful restart)
reload_nginx() {
    log "Reloading nginx configuration..."
    if systemctl reload "$NGINX_SERVICE" 2>/dev/null || service "$NGINX_SERVICE" reload 2>/dev/null; then
        log "✓ Nginx reloaded successfully"
        return 0
    else
        log "WARNING: Failed to reload nginx, attempting full restart..."
        start_nginx
    fi
}

# Main execution
log "=== Starting SSL certificate renewal process ==="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    error_exit "This script must be run as root"
fi

# Check if certbot is installed
if ! command -v certbot >/dev/null 2>&1; then
    error_exit "certbot is not installed or not in PATH"
fi

# Check if nginx is installed
if ! command -v nginx >/dev/null 2>&1; then
    error_exit "nginx is not installed or not in PATH"
fi

# Record initial nginx status
NGINX_WAS_RUNNING=false
if is_nginx_running; then
    NGINX_WAS_RUNNING=true
    log "Nginx is currently running"
else
    log "Nginx is not currently running"
fi

# Stop nginx if it's running
if [ "$NGINX_WAS_RUNNING" = true ]; then
    if ! stop_nginx; then
        error_exit "Could not stop nginx - certificate renewal cancelled"
    fi
    
    # Wait a moment for ports to be released
    sleep 2
fi

# Run certificate renewal
log "Running certificate renewal..."
if $CERTBOT_CMD --quiet 2>>"$LOG_FILE"; then
    log "✓ Certificate renewal completed successfully"
    RENEWAL_SUCCESS=true
else
    log "WARNING: Certificate renewal failed or no certificates needed renewal"
    RENEWAL_SUCCESS=false
fi

# Start nginx back up if it was running before
if [ "$NGINX_WAS_RUNNING" = true ]; then
    # Test nginx configuration before starting
    if test_nginx_config; then
        if [ "$RENEWAL_SUCCESS" = true ]; then
            # If certificates were renewed, do a full restart
            start_nginx
        else
            # If no renewal, just start normally
            start_nginx
        fi
    else
        error_exit "Nginx configuration is invalid - please check your config files"
    fi
else
    log "Nginx was not running initially, leaving it stopped"
fi

# Final status check
if [ "$NGINX_WAS_RUNNING" = true ] && is_nginx_running; then
    log "✓ Nginx is running and serving requests"
elif [ "$NGINX_WAS_RUNNING" = false ]; then
    log "✓ Nginx remains stopped as it was initially"
else
    error_exit "Nginx should be running but is not responding"
fi

log "=== Certificate renewal process completed ==="

# Optional: Check certificate expiration dates
log "Current certificate status:"
certbot certificates 2>/dev/null | grep -E "(Certificate Name|Expiry Date)" | tee -a "$LOG_FILE"

exit 0
