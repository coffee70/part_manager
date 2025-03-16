#!/usr/bin/env node
/**
 * Migration script template
 * 
 * Copy this file to create a new migration script.
 * Rename it to the version number, e.g., 2.0.2.ts
 * 
 * To run this migration:
 * npm run migrate src/migrations/your-new-file.ts
 */
import { Db } from 'mongodb';
import { runMigration, logUpdateResult, createIndex } from './utils/db';
// Uncomment if needed:
// import { exampleAddReferences, exampleDataTransformation } from './utils/examples';

/**
 * Migration logic
 * Add your migration code here
 */
async function migrate(db: Db): Promise<void> {
  // Example: Check if a collection exists
  const collections = await db.listCollections().toArray();
  const collectionExists = collections.some(c => c.name === 'your_collection_name');
  
  if (collectionExists) {
    console.log('Collection exists, performing updates...');
    
    // Add your migration logic here
    // For example:
    // const result = await db.collection('your_collection').updateMany(
    //   { field: { $exists: false } }, 
    //   { $set: { field: 'default value' } }
    // );
    // logUpdateResult('your_collection', result);
  }
  
  // Add more migration operations as needed
}

// Run the migration with the version name
// Change this to match your migration version
const MIGRATION_VERSION = 'template';

// Execute the migration
runMigration(MIGRATION_VERSION, migrate).catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 