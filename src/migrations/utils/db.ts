import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Executes a migration function with database connection handling
 * 
 * @param migrationName The name/version of the migration
 * @param migrationFn The function containing the migration logic
 */
export async function runMigration(
  migrationName: string,
  migrationFn: (db: Db) => Promise<void>
): Promise<void> {
  console.log(`Starting migration ${migrationName}...`);
  
  // Get MongoDB connection string from environment variables
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_NAME;
  
  if (!uri) {
    console.error('Error: MONGODB_URI environment variable is not set');
    process.exit(1);
  }
  
  if (!dbName) {
    console.error('Error: MONGODB_NAME environment variable is not set');
    process.exit(1);
  }

  // Setup MongoDB client options
  const options = { appName: `part_manager.migration.${migrationName}` };
  
  let client: MongoClient | null = null;
  
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    client = new MongoClient(uri, options);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get the database
    const db = client.db(dbName);
    console.log(`Connected to database: ${db.databaseName}`);
    
    // List all collections (useful for debugging)
    console.log('Listing collections in database...');
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Run the migration function
    console.log(`Executing migration ${migrationName}...`);
    await migrationFn(db);
    
    console.log(`Migration ${migrationName} completed successfully`);
  } catch (error) {
    console.error(`Migration ${migrationName} failed:`, error);
    process.exit(1);
  } finally {
    // Close the connection
    if (client) {
      console.log('Closing MongoDB connection...');
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

/**
 * Helper function to log the result of an update operation
 */
export function logUpdateResult(collectionName: string, result: { matchedCount: number; modifiedCount: number }): void {
  console.log(`Updated ${result.modifiedCount}/${result.matchedCount} documents in ${collectionName}`);
}

/**
 * Helper to execute and log an index creation
 */
export async function createIndex(db: Db, collectionName: string, indexSpec: Record<string, number>, options: Record<string, any> = {}): Promise<void> {
  await db.collection(collectionName).createIndex(indexSpec, { background: true, ...options });
  const fieldNames = Object.keys(indexSpec).join(', ');
  console.log(`Created index on ${collectionName}.${fieldNames}`);
} 