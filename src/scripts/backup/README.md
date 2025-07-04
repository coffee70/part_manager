# Backup & Restore Scripts

## Files

### Backup Scripts
- `dump_db.sh` - Creates a timestamped tarball backup of MongoDB and uploaded files
- `backup.sh` - **Main backup script** - Runs database backup and uploads to Google Drive
- `upload-googledrive.js` - Uploads the latest backup tarball to Google Drive
- `upload-onedrive.js` - Uploads the latest backup tarball to Microsoft OneDrive (alternative option)

### Restore Scripts
- `restore.sh` - **Main restore script** - Downloads latest backup from Google Drive and restores everything
- `download-googledrive.js` - Downloads the latest backup tarball from Google Drive
- `restore_db.sh` - Restores MongoDB database and file uploads from a backup tarball

## Quick Start (Google Drive - Recommended)

### 1. Install Dependencies

```bash
npm install googleapis dotenv
```

### 2. Setup Google Drive (Primary Option)

Follow the **Setup for Google Drive Upload** section below, then run:

```bash
# Full backup and upload process
./backup.sh

# Full restore process (downloads latest backup and restores everything)
./restore.sh
```

The main `backup.sh` script will automatically create a backup and upload it to Google Drive.
The main `restore.sh` script will download the latest backup and restore both MongoDB and file uploads.

## Setup for Google Drive Upload

### 1. Create Google Cloud Project and Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Drive API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Drive API" and enable it
4. Create a service account:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Fill in the details and create
5. Generate a key for the service account:
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose JSON format and download the file

### 2. Setup Service Account Access

1. Save the downloaded JSON key file to a secure location (e.g., `~/google-drive-service-account.json`)
2. **Important**: Share your Google Drive (or a specific folder) with the service account email:
   - Open Google Drive in your browser
   - Create a "backups" folder (optional - script will create one if it doesn't exist)
   - Right-click and select "Share"
   - Add the service account email (found in the JSON file as `client_email`)
   - Give it "Editor" permission

### 3. Create .env File for Google Drive

Add to your `.env` file in the project root:

```bash
# Google Drive API Credentials
GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_PATH=/path/to/your/service-account-key.json
GOOGLE_DRIVE_FOLDER_ID=optional-specific-folder-id
```

**Note**: If you don't specify `GOOGLE_DRIVE_FOLDER_ID`, the script will create/find a "backups" folder in the root of the shared Drive.

## Setup for OneDrive Upload (Alternative Option)

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

### 5. Create .env File for OneDrive

Add to your `.env` file:

```bash
# Microsoft OneDrive API Credentials (alternative option)
ONEDRIVE_CLIENT_ID=your-client-id-from-app-registration
ONEDRIVE_CLIENT_SECRET=your-client-secret-value
ONEDRIVE_TENANT_ID=your-tenant-id-from-app-registration
ONEDRIVE_USER_ID=your-email@domain.com
```

## Usage

### Backup Operations

#### Recommended: Full Backup Process (Google Drive)
```bash
./backup.sh
```
This runs the complete backup and upload process.

#### Manual Backup Steps:

##### Create Backup
```bash
./dump_db.sh
```

##### Upload to Google Drive
```bash
node upload-googledrive.js
```

##### Upload to OneDrive (Alternative)
```bash
node upload-onedrive.js
```

All upload scripts will automatically find and upload the latest `.tgz` file from `~/backups/`.

**Google Drive**: Files will be uploaded to the shared "backups" folder (or specified folder ID).
**OneDrive**: Files will be uploaded to `/backups/` folder in the specified user's OneDrive.

### Restore Operations

#### Recommended: Full Restore Process (Google Drive)
```bash
./restore.sh
```
This downloads the latest backup from Google Drive and restores both MongoDB and file uploads.

#### Restore from Specific Backup File
```bash
./restore.sh /path/to/backup/file.tgz
```
This restores from a specific backup file without downloading from Google Drive.

#### Manual Restore Steps:

##### Download Latest Backup from Google Drive
```bash
node download-googledrive.js
```

##### Restore from Backup File
```bash
./restore_db.sh [backup_file_path] [--no-confirm] [--no-restart-prompt]
```
If no backup file is specified, it will use the latest `.tgz` file in `~/backups/`.
- `--no-confirm`: Skip the confirmation prompt (useful for automated scripts)
- `--no-restart-prompt`: Skip the container restart prompt

**Important Notes for Restore:**
- **DATA LOSS WARNING**: Restore operations will REPLACE all current data in MongoDB and file-service
- Make sure Docker containers (`mongo` and `file-service`) are running before restoring
- You will be prompted for confirmation before proceeding with destructive operations
- Consider taking a backup of current data before restoring if needed
- Test the restored data thoroughly after completion

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- For Google Drive: The service account JSON key file contains sensitive credentials
- For OneDrive: Client secrets have expiration dates - monitor and renew as needed
- Consider using restricted scopes and specific folder access when possible 