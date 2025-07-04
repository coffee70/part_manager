#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config({ path: '../../../.env' });

// Configuration from environment variables
const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_PATH;
const PARENT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // Optional: specific folder ID, otherwise uploads to root
const BACKUP_DIR = require('os').homedir() + '/backups';

class GoogleDriveUploader {
    constructor() {
        this.drive = null;
    }

    async authenticate() {
        try {
            // Check if service account key file exists
            if (!fs.existsSync(SERVICE_ACCOUNT_KEY_PATH)) {
                throw new Error(`Service account key file not found: ${SERVICE_ACCOUNT_KEY_PATH}`);
            }

            // Create JWT auth client using the correct options object syntax
            const auth = new google.auth.JWT({
                keyFile: SERVICE_ACCOUNT_KEY_PATH,
                scopes: ['https://www.googleapis.com/auth/drive.file']
            });

            // Authorize the client
            await auth.authorize();
            
            // Create Drive API client
            this.drive = google.drive({ version: 'v3', auth });
            
            console.log('✓ Successfully authenticated with Google Drive API');
        } catch (error) {
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    async uploadFile(filePath, fileName) {
        if (!this.drive) {
            throw new Error('Not authenticated. Call authenticate() first.');
        }

        const fileSize = fs.statSync(filePath).size;
        console.log(`Uploading ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)...`);

        try {
            // Create file metadata
            const fileMetadata = {
                name: fileName,
                parents: PARENT_FOLDER_ID ? [PARENT_FOLDER_ID] : undefined
            };

            // Create media object
            const media = {
                mimeType: 'application/gzip',
                body: fs.createReadStream(filePath)
            };

            // Upload file
            const response = await this.drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id,name,webViewLink,size'
            });

            return response.data;
        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    async findLatestBackup() {
        if (!fs.existsSync(BACKUP_DIR)) {
            throw new Error(`Backup directory ${BACKUP_DIR} does not exist`);
        }

        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.endsWith('.tgz'))
            .map(file => ({
                name: file,
                path: path.join(BACKUP_DIR, file),
                mtime: fs.statSync(path.join(BACKUP_DIR, file)).mtime
            }))
            .sort((a, b) => b.mtime - a.mtime);

        if (files.length === 0) {
            throw new Error('No backup files found in ~/backups directory');
        }

        return files[0];
    }

    async createBackupFolder() {
        if (!this.drive) {
            throw new Error('Not authenticated. Call authenticate() first.');
        }

        try {
            // Check if backups folder already exists
            const response = await this.drive.files.list({
                q: "name='backups' and mimeType='application/vnd.google-apps.folder'",
                fields: 'files(id, name)'
            });

            if (response.data.files.length > 0) {
                console.log('✓ Found existing backups folder');
                return response.data.files[0].id;
            }

            // Create backups folder
            const folderMetadata = {
                name: 'backups',
                mimeType: 'application/vnd.google-apps.folder'
            };

            const folder = await this.drive.files.create({
                resource: folderMetadata,
                fields: 'id'
            });

            console.log('✓ Created backups folder in Google Drive');
            return folder.data.id;
        } catch (error) {
            throw new Error(`Failed to create backup folder: ${error.message}`);
        }
    }
}

async function main() {
    try {
        // Validate environment variables
        if (!SERVICE_ACCOUNT_KEY_PATH) {
            throw new Error('Missing required environment variable: GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_PATH');
        }

        const uploader = new GoogleDriveUploader();
        
        // Find the latest backup file
        console.log('Finding latest backup file...');
        const latestBackup = await uploader.findLatestBackup();
        console.log(`Found latest backup: ${latestBackup.name}`);

        // Authenticate with Google Drive
        console.log('Authenticating with Google Drive...');
        await uploader.authenticate();

        // Create or find backups folder if no specific folder ID is provided
        if (!PARENT_FOLDER_ID) {
            console.log('Creating/finding backups folder...');
            const folderId = await uploader.createBackupFolder();
            process.env.GOOGLE_DRIVE_FOLDER_ID = folderId; // Set for this session
        }

        // Upload the file
        console.log('Starting upload to Google Drive...');
        const result = await uploader.uploadFile(latestBackup.path, latestBackup.name);
        
        console.log('✓ Upload completed successfully!');
        console.log(`File uploaded: ${result.name}`);
        console.log(`Google Drive file ID: ${result.id}`);
        console.log(`View file: ${result.webViewLink}`);
        console.log(`File size: ${(parseInt(result.size) / 1024 / 1024).toFixed(2)} MB`);

    } catch (error) {
        console.error('❌ Upload failed:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
} 