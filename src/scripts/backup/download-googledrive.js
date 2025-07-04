#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config({ path: '../../../.env' });

// Configuration from environment variables
const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_PATH;
const PARENT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // Optional: specific folder ID, otherwise searches root
const BACKUP_DIR = require('os').homedir() + '/backups';

class GoogleDriveDownloader {
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

    async findLatestBackupFile() {
        if (!this.drive) {
            throw new Error('Not authenticated. Call authenticate() first.');
        }

        try {
            let query = "name contains '.tgz' and trashed=false";
            
            // If a specific folder ID is provided, search within that folder
            if (PARENT_FOLDER_ID) {
                query += ` and '${PARENT_FOLDER_ID}' in parents`;
            } else {
                // Look for backups folder first
                const foldersResponse = await this.drive.files.list({
                    q: "name='backups' and mimeType='application/vnd.google-apps.folder' and trashed=false",
                    fields: 'files(id, name)'
                });

                if (foldersResponse.data.files.length > 0) {
                    const backupsFolderId = foldersResponse.data.files[0].id;
                    query += ` and '${backupsFolderId}' in parents`;
                    console.log('✓ Found backups folder, searching within it');
                }
            }

            // Search for .tgz files
            const response = await this.drive.files.list({
                q: query,
                orderBy: 'createdTime desc',
                fields: 'files(id, name, size, createdTime, webViewLink)',
                pageSize: 10
            });

            if (response.data.files.length === 0) {
                throw new Error('No backup files found in Google Drive');
            }

            // Return the most recent backup file
            const latestFile = response.data.files[0];
            console.log(`✓ Found latest backup: ${latestFile.name} (${new Date(latestFile.createdTime).toLocaleString()})`);
            
            return latestFile;
        } catch (error) {
            throw new Error(`Failed to find backup files: ${error.message}`);
        }
    }

    async downloadFile(file, downloadPath) {
        if (!this.drive) {
            throw new Error('Not authenticated. Call authenticate() first.');
        }

        try {
            console.log(`Downloading ${file.name} (${(parseInt(file.size) / 1024 / 1024).toFixed(2)} MB)...`);

            // Create the download directory if it doesn't exist
            const downloadDir = path.dirname(downloadPath);
            if (!fs.existsSync(downloadDir)) {
                fs.mkdirSync(downloadDir, { recursive: true });
            }

            // Get file content
            const response = await this.drive.files.get({
                fileId: file.id,
                alt: 'media'
            }, { responseType: 'stream' });

            // Create write stream
            const writeStream = fs.createWriteStream(downloadPath);

            // Track download progress
            let downloadedBytes = 0;
            const totalBytes = parseInt(file.size);

            response.data.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                const progress = ((downloadedBytes / totalBytes) * 100).toFixed(1);
                process.stdout.write(`\rDownloading... ${progress}%`);
            });

            // Pipe the response to file
            response.data.pipe(writeStream);

            return new Promise((resolve, reject) => {
                writeStream.on('finish', () => {
                    console.log('\n✓ Download completed successfully');
                    resolve(downloadPath);
                });

                writeStream.on('error', (error) => {
                    reject(new Error(`Download failed: ${error.message}`));
                });
            });

        } catch (error) {
            throw new Error(`Failed to download file: ${error.message}`);
        }
    }

    async downloadLatestBackup() {
        // Ensure backup directory exists
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
            console.log(`✓ Created backup directory: ${BACKUP_DIR}`);
        }

        // Find the latest backup file
        const latestFile = await this.findLatestBackupFile();
        
        // Download the file
        const downloadPath = path.join(BACKUP_DIR, latestFile.name);
        
        // Check if file already exists
        if (fs.existsSync(downloadPath)) {
            const existingSize = fs.statSync(downloadPath).size;
            const remoteSize = parseInt(latestFile.size);
            
            if (existingSize === remoteSize) {
                console.log(`✓ File already exists with correct size: ${downloadPath}`);
                return { file: latestFile, downloadPath };
            } else {
                console.log('File exists but size differs, re-downloading...');
            }
        }

        await this.downloadFile(latestFile, downloadPath);
        
        return { file: latestFile, downloadPath };
    }
}

async function main() {
    try {
        // Validate environment variables
        if (!SERVICE_ACCOUNT_KEY_PATH) {
            throw new Error('Missing required environment variable: GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_PATH');
        }

        const downloader = new GoogleDriveDownloader();
        
        // Authenticate with Google Drive
        console.log('Authenticating with Google Drive...');
        await downloader.authenticate();

        // Download the latest backup
        console.log('Finding and downloading latest backup...');
        const result = await downloader.downloadLatestBackup();
        
        console.log('✓ Download process completed successfully!');
        console.log(`Downloaded file: ${result.file.name}`);
        console.log(`Local path: ${result.downloadPath}`);
        console.log(`File size: ${(parseInt(result.file.size) / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Created: ${new Date(result.file.createdTime).toLocaleString()}`);

        // Return the path for use by other scripts
        process.stdout.write(`\nDOWNLOAD_PATH=${result.downloadPath}\n`);

    } catch (error) {
        console.error('❌ Download failed:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = GoogleDriveDownloader; 