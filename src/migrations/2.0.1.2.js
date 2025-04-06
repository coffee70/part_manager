#!/usr/bin/env node
/**
 * Migration script for version 2.0.1.2
 * 
 * This script performs database migrations for version 2.0.1.2.
 * Updates route.currentStepId in all instance collections:
 * - Sets route.currentStepId to null for all instances that have a route
 * 
 * To run this script:
 * npm run migrate:2.0.1.2
 * 
 * To run in dry-run mode (no updates):
 * DRY_RUN=true npm run migrate:2.0.1.2
 */
const { runMigration, logUpdateResult } = require('./utils/db');

/**
 * Migration logic for version 2.0.1.2
 */
async function migrate(db) {
  // Check if we're in dry run mode
  const isDryRun = process.env.DRY_RUN === 'true';
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE: No changes will be made to the database');
  }

  // Get all models (each model _id is the name of an instance collection)
  console.log('Getting list of models...');
  const models = await db.collection('models').find({}, { projection: { _id: 1, name: 1 } }).toArray();
  console.log(`Found ${models.length} models to process`);

  // Keep track of results
  let totalInstancesChecked = 0;
  let totalInstancesNeedUpdate = 0;
  let totalInstancesUpdated = 0;

  // Process each model's instance collection
  for (const model of models) {
    const collectionName = model._id.toString();
    const modelName = model.name || collectionName;
    console.log(`\nProcessing model: ${modelName} (collection: ${collectionName})`);

    // Check if the collection exists
    const collections = await db.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
      console.log(`  Collection ${collectionName} does not exist, skipping`);
      continue;
    }

    // Get all instances that have a route attribute
    const instances = await db.collection(collectionName).find({
      route: { $exists: true }
    }).toArray();

    totalInstancesChecked += instances.length;
    console.log(`  Found ${instances.length} instances with route attribute`);

    // Process each instance
    for (const instance of instances) {
      // Check if the instance has a valid route object
      if (
        instance.route
        && typeof instance.route === 'object'
        && instance.route.currentStepId !== null
      ) {
        totalInstancesNeedUpdate++;

        // Only update if not in dry run mode
        if (!isDryRun) {
          // Update the instance to set route.currentStepId to null
          const result = await db.collection(collectionName).updateOne(
            { _id: instance._id },
            {
              $set: {
                'route.currentStepId': null,
                'route.state': "stopped"
              }
            }
          );

          if (result.modifiedCount > 0) {
            totalInstancesUpdated++;
          }
        }
      }
    }
  }

  // Log summary
  console.log('\nMigration Summary:');
  console.log(`- Total instances checked: ${totalInstancesChecked}`);
  console.log(`- Instances need update: ${totalInstancesNeedUpdate}`);

  if (!isDryRun) {
    console.log(`- Instances updated: ${totalInstancesUpdated}`);
  } else {
    console.log('No updates performed (dry run mode)');
  }

  // Final conclusion
  if (totalInstancesNeedUpdate === 0) {
    console.log('\n✅ No instances with non-null currentStepId found. No migration needed.');
  } else if (isDryRun) {
    console.log('\n⚠️ Found instances with non-null currentStepId that need updating.');
    console.log('Re-run without DRY_RUN=true to update them.');
  } else if (totalInstancesUpdated === totalInstancesNeedUpdate) {
    console.log('\n✅ Migration completed successfully.');
    console.log('All instances with non-null currentStepId have been updated.');
  } else {
    console.log('\n⚠️ Migration partially completed.');
    console.log(`${totalInstancesUpdated}/${totalInstancesNeedUpdate} instances were updated.`);
  }
}

// Run the migration with the version name
const MIGRATION_VERSION = '2.0.1.2';

// Execute the migration
runMigration(MIGRATION_VERSION, migrate).catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 