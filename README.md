# Part Manager

A comprehensive part management system built with Next.js, MongoDB, and Docker.

## Prerequisites

- Docker and Docker Compose installed
- Node.js (for development mode)
- npm or yarn package manager

## Getting Started

### 1. Start Docker Services

First, start the required Docker containers (MongoDB and file service):

```bash
docker-compose up -d
```

This will start:
- MongoDB database on port 27017
- File service on port 9000

### 2. Environment Configuration

Create a `.env` file in the project root with the following variables:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_NAME=part_manager

# File Service Configuration
FILE_POST_URL=http://localhost:9000/upload/
FILE_GET_URL=http://localhost:9000/files/
FILE_DELETE_URL=http://localhost:9000/delete/

# Optional: Google Drive Backup Configuration
GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_PATH=/path/to/your/service-account-key.json
GOOGLE_DRIVE_FOLDER_ID=optional-specific-folder-id

# Optional: OneDrive Backup Configuration (alternative)
ONEDRIVE_CLIENT_ID=your-client-id-from-app-registration
ONEDRIVE_CLIENT_SECRET=your-client-secret-value
ONEDRIVE_TENANT_ID=your-tenant-id-from-app-registration
ONEDRIVE_USER_ID=your-email@domain.com
```

### 3. Development Mode

For development with hot reloading:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

### 4. Production Mode

For production deployment:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm run start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code linting
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Backup and Restore

For backup and restore functionality, see the detailed documentation in `src/scripts/backup/README.md`.

## Known Issues

Next.js currently installs eslint@8.57.1. This package leads to numerous deprecated packages being printed on a clean install:

```bash
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated npmlog@5.0.1: This package is no longer supported.
npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated are-we-there-yet@2.0.0: This package is no longer supported.
npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated gauge@3.0.2: This package is no longer supported.
npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
```

Version 9.15.0 will resolve these deprecated warnings, however eslint-plugin-next does not support this major eslint version, thus these deprecated packages must stay until Next.js puts out updates.
