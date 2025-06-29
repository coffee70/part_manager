# Backup Scripts

## Files

- `dump_db.sh` - Creates a timestamped tarball backup of MongoDB and uploaded files
- `upload.js` - Uploads the latest backup tarball to Microsoft OneDrive

## Setup for OneDrive Upload

### 1. Install Dependencies

```bash
npm install axios dotenv
```

### 2. Create Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps)
2. Click "New registration"
3. Name your app (e.g., "Backup Uploader")
4. Set supported account types to "Accounts in this organizational directory only"
5. Click "Register"

### 3. Configure App Permissions

1. Go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Choose "Application permissions"
5. Add these permissions:
   - `Files.ReadWrite.All`
6. Click "Grant admin consent"

### 4. Create Client Secret

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Add description and set expiration
4. Copy the secret value (you won't see it again!)

### 5. Create .env File

Create a `.env` file in this directory with:

```bash
# Microsoft OneDrive API Credentials
ONEDRIVE_CLIENT_ID=your-client-id-from-app-registration
ONEDRIVE_CLIENT_SECRET=your-client-secret-value
ONEDRIVE_TENANT_ID=your-tenant-id-from-app-registration
```

## Usage

### Create Backup
```bash
./dump_db.sh
```

### Upload to OneDrive
```bash
node upload.js
```

The upload script will automatically find and upload the latest `.tgz` file from `/backups/`.

Files will be uploaded to `/backups/` folder in your OneDrive. 