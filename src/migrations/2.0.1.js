#!/usr/bin/env node
/**
 * Migration script for version 2.0.1 
 * 
 * This script performs database migrations for version 2.0.1.
 * Updates links attribute in all instance collections:
 * - Changes "modelId" to "contextId" in each link object
 * 
 * To run this script:
 * npm run migrate:2.0.1
 * 
 * Or directly with Node:
 * node src/migrations/2.0.1.js
 * 
 * To run in dry-run mode (no updates):
 * DRY_RUN=true node src/migrations/2.0.1.js
 */
const { ObjectId } = require('mongodb');
const { runMigration, logUpdateResult } = require('./utils/db');

/**
 * Migration logic for version 2.0.1
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
  let totalLinksChecked = 0;
  let totalLinksWithModelId = 0;
  let totalLinksWithContextId = 0;
  let totalLinksUpdated = 0;
  
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
    
    // Get all instances that have a links attribute
    const instances = await db.collection(collectionName).find({ 
      links: { $exists: true } 
    }).toArray();
    
    totalInstancesChecked += instances.length;
    console.log(`  Found ${instances.length} instances with links attribute`);
    
    // Process each instance
    for (const instance of instances) {
      // Check if the instance has a valid links array
      const hasLinks = instance.links && Array.isArray(instance.links) && instance.links.length > 0;
      
      if (!hasLinks) {
        console.log(`  Instance ${instance._id}: has empty links array or non-array value`);
        continue;
      }
      
      // Count the links
      totalLinksChecked += instance.links.length;
      
      // Check each link's structure
      let modelIdLinks = 0;
      let contextIdLinks = 0;
      
      instance.links.forEach(link => {
        if ('modelId' in link) modelIdLinks++;
        if ('contextId' in link) contextIdLinks++;
      });
      
      totalLinksWithModelId += modelIdLinks;
      totalLinksWithContextId += contextIdLinks;
      
      console.log(`  Instance ${instance._id}: ${instance.links.length} links, ${modelIdLinks} with modelId, ${contextIdLinks} with contextId`);
      
      // If any links have modelId, they need to be updated
      if (modelIdLinks > 0) {
        totalInstancesNeedUpdate++;
        
        // Debug: Log sample links
        if (modelIdLinks > 0) {
          const modelIdLink = instance.links.find(link => 'modelId' in link);
          console.log(`    Sample link with modelId: ${JSON.stringify(modelIdLink)}`);
        }
        
        if (contextIdLinks > 0) {
          const contextIdLink = instance.links.find(link => 'contextId' in link);
          console.log(`    Sample link with contextId: ${JSON.stringify(contextIdLink)}`);
        }
        
        // Only update if not in dry run mode
        if (!isDryRun) {
          // Update links: rename modelId to contextId
          const updatedLinks = instance.links.map(link => {
            if ('modelId' in link) {
              const { modelId, ...rest } = link;
              return { ...rest, contextId: modelId };
            }
            return link;
          });
          
          // Update the instance with the modified links
          const result = await db.collection(collectionName).updateOne(
            { _id: instance._id },
            { $set: { links: updatedLinks } }
          );
          
          console.log(`    Updated instance: modifiedCount = ${result.modifiedCount}`);
          
          if (result.modifiedCount > 0) {
            totalInstancesUpdated++;
            totalLinksUpdated += modelIdLinks;
          }
        }
      }
    }
  }
  
  // Log summary
  console.log('\nMigration Summary:');
  console.log(`- Total instances checked: ${totalInstancesChecked}`);
  console.log(`- Total links checked: ${totalLinksChecked}`);
  console.log(`- Links with modelId: ${totalLinksWithModelId}`);
  console.log(`- Links with contextId: ${totalLinksWithContextId}`);
  console.log(`- Instances needing update: ${totalInstancesNeedUpdate}`);
  
  if (!isDryRun) {
    console.log(`- Instances updated: ${totalInstancesUpdated}`);
    console.log(`- Links updated: ${totalLinksUpdated}`);
  } else {
    console.log('No updates performed (dry run mode)');
  }
  
  // Final conclusion
  if (totalLinksWithModelId === 0) {
    console.log('\n✅ All links are already using the correct contextId attribute format.');
    console.log('No migration needed.');
  } else if (isDryRun) {
    console.log('\n⚠️ There are links using the old modelId format.');
    console.log('Re-run without DRY_RUN=true to update them.');
  } else if (totalInstancesUpdated === totalInstancesNeedUpdate) {
    console.log('\n✅ Migration completed successfully.');
    console.log('All links have been updated to the new format.');
  } else {
    console.log('\n⚠️ Migration partially completed.');
    console.log(`${totalInstancesUpdated}/${totalInstancesNeedUpdate} instances were updated.`);
  }
}

// Run the migration with the utility function
runMigration('2.0.1', migrate).catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
