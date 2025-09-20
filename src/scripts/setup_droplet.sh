#!/bin/bash

# Env Vars
FILE_GET_URL="http://localhost:9000/get/"
FILE_POST_URL="http://localhost:9000/upload/"
FILE_DELETE_URL="http://localhost:9000/delete/"
MONGODB_URI="mongodb://localhost:27017/manager"
MONGODB_NAME="manager"
DOMAIN_NAME="test-manager.aentx.com"
EMAIL="ehaeick2@gmail.com"

# Script Vars
MANAGER_REPO_URL="https://github.com/coffee70/part_manager.git"
MANAGER_APP_DIR=/home/nodejs/manager
FILE_SERVICE_REPO_URL="https://github.com/coffee70/file-service.git"
FILE_SERVICE_APP_DIR=/home/nodejs/file-service
SWAP_SIZE="1G"  # Swap size of 1GB

# Update package list and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Update node to version 22
set -e

# === Upgrade Node.js from 20 to 22 ===
echo ">>> Adding NodeSource repo for Node 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

echo ">>> Installing Node.js 22..."
sudo apt-get install -y nodejs

echo ">>> Checking Node & npm versions..."
node -v
npm -v

# Add Swap Space
SWAP_SIZE="1G"  # Swap size of 1GB
echo ">>> Adding swap space..."
sudo fallocate -l $SWAP_SIZE /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Install Docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" -y
sudo apt update
sudo apt install docker-ce -y

# Install Docker Compose
sudo rm -f /usr/local/bin/docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Wait for the file to be fully downloaded before proceeding
if [ ! -f /usr/local/bin/docker-compose ]; then
  echo "Docker Compose download failed. Exiting."
  exit 1
fi

sudo chmod +x /usr/local/bin/docker-compose

# Ensure Docker Compose is executable and in path
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verify Docker Compose installation
docker-compose --version
if [ $? -ne 0 ]; then
  echo "Docker Compose installation failed. Exiting."
  exit 1
fi

# Ensure Docker starts on boot and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Clone the File Service Git repository
if [ -d "$FILE_SERVICE_APP_DIR" ]; then
  echo "Directory $FILE_SERVICE_APP_DIR already exists. Pulling latest changes..."
  cd $FILE_SERVICE_APP_DIR && git pull
else
  echo "Cloning repository from $FILE_SERVICE_REPO_URL..."
  git clone $FILE_SERVICE_REPO_URL $FILE_SERVICE_APP_DIR
  cd $FILE_SERVICE_APP_DIR
fi

cd $FILE_SERVICE_APP_DIR

# Build the File Service Docker Image
./build.sh

# Clone the Manager Git repository
if [ -d "$MANAGER_APP_DIR" ]; then
  echo "Directory $MANAGER_APP_DIR already exists. Pulling latest changes..."
  cd $MANAGER_APP_DIR && git pull
else
  echo "Cloning repository from $MANAGER_REPO_URL..."
  git clone $MANAGER_REPO_URL $MANAGER_APP_DIR
  cd $MANAGER_APP_DIR
fi

cd $MANAGER_APP_DIR

echo "FILE_GET_URL=$FILE_GET_URL" > $MANAGER_APP_DIR/.env
echo "FILE_POST_URL=$FILE_POST_URL" >> $MANAGER_APP_DIR/.env
echo "FILE_DELETE_URL=$FILE_DELETE_URL" >> $MANAGER_APP_DIR/.env
echo "MONGODB_URI=$MONGODB_URI" >> $MANAGER_APP_DIR/.env
echo "MONGODB_NAME=$MONGODB_NAME" >> $MANAGER_APP_DIR/.env

# Build the Manager application
cd $MANAGER_APP_DIR
npm install 
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Install Nginx``
sudo apt install nginx -y

# Remove old Nginx config (if it exists)
sudo rm -f /etc/nginx/sites-available/myapp
sudo rm -f /etc/nginx/sites-enabled/myapp

# Stop Nginx temporarily to allow Certbot to run in standalone mode
sudo systemctl stop nginx

# Obtain SSL certificate using Certbot standalone mode
sudo apt install certbot -y
sudo certbot certonly --standalone -d $DOMAIN_NAME --non-interactive --agree-tos -m $EMAIL

# Ensure SSL files exist or generate them
if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then
  sudo wget https://raw.githubusercontent.com/certbot/certbot/refs/heads/main/certbot-nginx/src/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -P /etc/letsencrypt/
fi

if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
  sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
fi

# Create Nginx config with reverse proxy, SSL support, rate limiting, and streaming support
sudo cat > /etc/nginx/sites-available/myapp <<EOL
limit_req_zone \$binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    listen 80;
    server_name $DOMAIN_NAME;

    # Redirect all HTTP requests to HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN_NAME;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Enable rate limiting
    limit_req zone=mylimit burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # Disable buffering for streaming support
        proxy_buffering off;
        proxy_set_header X-Accel-Buffering no;
    }
}
EOL

# Create symbolic link if it doesn't already exist
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp

# Restart Nginx to apply the new configuration
sudo systemctl restart nginx

# Build and run the Docker containers from the app directory (~/myapp)
cd $MANAGER_APP_DIR
sudo docker-compose up -d

# Check if Docker Compose started correctly
if ! sudo docker-compose ps | grep "Up"; then
  echo "Docker containers failed to start. Check logs with 'docker-compose logs'."
  exit 1
fi

# Setup automatic SSL certificate renewal...
( crontab -l 2>/dev/null; echo "0 */12 * * * certbot renew --quiet && systemctl reload nginx" ) | crontab -

# Install PM2
sudo npm install -g pm2

# Update PM2
sudo -u nodejs pm2 update

# Remote hello process started by pm2
sudo -u nodejs pm2 delete hello

# Start the Manager application with PM2
sudo -u nodejs pm2 start npm --name "manager" -- run start

# Save the PM2 process list
sudo -u nodejs pm2 save

# Start PM2 on system boot
sudo -u nodejs pm2 startup