#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Configuration from environment variables
const CLIENT_ID = process.env.ONEDRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.ONEDRIVE_CLIENT_SECRET;
const TENANT_ID = process.env.ONEDRIVE_TENANT_ID;
const BACKUP_DIR = '/backups';

// Microsoft Graph API endpoints
const TOKEN_ENDPOINT = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';

class OneDriveUploader {
    constructor() {
        this.accessToken = null;
    }

    async authenticate() {
        try {
            const response = await axios.post(TOKEN_ENDPOINT, new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                scope: 'https://graph.microsoft.com/.default',
                grant_type: 'client_credentials'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            this.accessToken = response.data.access_token;
            console.log('✓ Successfully authenticated with Microsoft Graph API');
        } catch (error) {
            throw new Error(`Authentication failed: ${error.response?.data?.error_description || error.message}`);
        }
    }

    async uploadFile(filePath, fileName) {
        if (!this.accessToken) {
            throw new Error('Not authenticated. Call authenticate() first.');
        }

        const fileSize = fs.statSync(filePath).size;
        console.log(`Uploading ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)...`);

        try {
            // For files larger than 4MB, use resumable upload
            if (fileSize > 4 * 1024 * 1024) {
                return await this.uploadLargeFile(filePath, fileName, fileSize);
            } else {
                return await this.uploadSmallFile(filePath, fileName);
            }
        } catch (error) {
            throw new Error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    async uploadSmallFile(filePath, fileName) {
        const fileBuffer = fs.readFileSync(filePath);
        const uploadUrl = `${GRAPH_API_BASE}/me/drive/root:/backups/${fileName}:/content`;

        const response = await axios.put(uploadUrl, fileBuffer, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/octet-stream'
            }
        });

        return response.data;
    }

    async uploadLargeFile(filePath, fileName, fileSize) {
        // Create upload session
        const createSessionUrl = `${GRAPH_API_BASE}/me/drive/root:/backups/${fileName}:/createUploadSession`;
        
        const sessionResponse = await axios.post(createSessionUrl, {
            item: {
                "@microsoft.graph.conflictBehavior": "replace",
                name: fileName
            }
        }, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const uploadUrl = sessionResponse.data.uploadUrl;
        const chunkSize = 320 * 1024; // 320KB chunks
        let uploadedBytes = 0;

        // Upload file in chunks
        const fileHandle = fs.openSync(filePath, 'r');
        
        try {
            while (uploadedBytes < fileSize) {
                const remainingBytes = fileSize - uploadedBytes;
                const currentChunkSize = Math.min(chunkSize, remainingBytes);
                const buffer = Buffer.alloc(currentChunkSize);
                
                fs.readSync(fileHandle, buffer, 0, currentChunkSize, uploadedBytes);
                
                const chunkResponse = await axios.put(uploadUrl, buffer, {
                    headers: {
                        'Content-Length': currentChunkSize,
                        'Content-Range': `bytes ${uploadedBytes}-${uploadedBytes + currentChunkSize - 1}/${fileSize}`
                    }
                });

                uploadedBytes += currentChunkSize;
                const progress = ((uploadedBytes / fileSize) * 100).toFixed(1);
                console.log(`Upload progress: ${progress}%`);

                // If upload is complete, return the response
                if (chunkResponse.status === 201 || chunkResponse.status === 200) {
                    return chunkResponse.data;
                }
            }
        } finally {
            fs.closeSync(fileHandle);
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
            throw new Error('No backup files found in /backups directory');
        }

        return files[0];
    }
}

async function main() {
    try {
        // Validate environment variables
        if (!CLIENT_ID || !CLIENT_SECRET || !TENANT_ID) {
            throw new Error('Missing required environment variables: ONEDRIVE_CLIENT_ID, ONEDRIVE_CLIENT_SECRET, ONEDRIVE_TENANT_ID');
        }

        const uploader = new OneDriveUploader();
        
        // Find the latest backup file
        console.log('Finding latest backup file...');
        const latestBackup = await uploader.findLatestBackup();
        console.log(`Found latest backup: ${latestBackup.name}`);

        // Authenticate with OneDrive
        console.log('Authenticating with Microsoft OneDrive...');
        await uploader.authenticate();

        // Upload the file
        console.log('Starting upload to OneDrive...');
        const result = await uploader.uploadFile(latestBackup.path, latestBackup.name);
        
        console.log('✓ Upload completed successfully!');
        console.log(`File uploaded to: ${result.webUrl}`);
        console.log(`OneDrive file ID: ${result.id}`);

    } catch (error) {
        console.error('❌ Upload failed:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}
