import { Db, ObjectId } from 'mongodb';

/**
 * Example migration operations
 * 
 * This file contains example migration operations that can be
 * used as reference when writing new migrations.
 * 
 * How to use:
 * 1. Copy the relevant examples to your migration file
 * 2. Modify them to suit your needs
 * 3. Delete any unused code
 */

// Example function showing common migration operations
export async function exampleMigrationOperations(db: Db): Promise<void> {
  // Example: Add a new field to all documents in a collection that don't have it
  const addFieldResult = await db.collection('example_collection').updateMany(
    { newField: { $exists: false } },  // Only update docs without the field
    { $set: { newField: 'default value' } }
  );
  console.log(`Added newField to ${addFieldResult.modifiedCount} documents`);

  // Example: Update specific documents based on a condition
  const updateResult = await db.collection('example_collection').updateMany(
    { status: 'old_status' },  // Query to match documents
    { $set: { status: 'new_status' } }
  );
  console.log(`Updated status for ${updateResult.modifiedCount} documents`);

  // Example: Create an index
  await db.collection('example_collection').createIndex(
    { fieldToIndex: 1 },  // 1 for ascending, -1 for descending
    { background: true }  // Create index in the background
  );
  console.log('Created index on example_collection.fieldToIndex');

  // Example: Remove a field from documents
  const removeFieldResult = await db.collection('example_collection').updateMany(
    {},
    { $unset: { oldField: "" } }
  );
  console.log(`Removed oldField from ${removeFieldResult.modifiedCount} documents`);

  // Example: Rename a field
  const renameFieldResult = await db.collection('example_collection').updateMany(
    {},
    { $rename: { "oldFieldName": "newFieldName" } }
  );
  console.log(`Renamed field in ${renameFieldResult.modifiedCount} documents`);

  // Example: Complex update with multiple operations
  const complexUpdateResult = await db.collection('example_collection').updateMany(
    { complexField: { $exists: true } },
    { 
      $set: { "processed": true },
      $currentDate: { "lastModified": true },
      $inc: { "version": 1 }
    }
  );
  console.log(`Complex update affected ${complexUpdateResult.modifiedCount} documents`);
  
  // Example: Delete documents
  const deleteResult = await db.collection('example_collection').deleteMany(
    { status: 'to_delete' }
  );
  console.log(`Deleted ${deleteResult.deletedCount} documents`);
}

// Example: Add a reference field between collections
export async function exampleAddReferences(db: Db): Promise<void> {
  // Get IDs from the source collection
  const sourceItems = await db.collection('source_collection').find({}, {
    projection: { _id: 1, name: 1 }
  }).toArray();
  
  // Update target documents to include references
  let updatedCount = 0;
  for (const item of sourceItems) {
    const result = await db.collection('target_collection').updateMany(
      { sourceName: item.name },
      { $set: { sourceId: item._id } }
    );
    updatedCount += result.modifiedCount;
  }
  
  console.log(`Added references to ${updatedCount} documents`);
}

// Example: Data transformation
export async function exampleDataTransformation(db: Db): Promise<void> {
  const items = await db.collection('items').find({}).toArray();
  
  let transformedCount = 0;
  for (const item of items) {
    // Example transformation: combine fields, format data, etc.
    const transformedData = {
      combinedField: `${item.field1} - ${item.field2}`,
      formattedDate: new Date(item.dateString),
      normalizedValue: item.value / 100
    };
    
    const result = await db.collection('items').updateOne(
      { _id: item._id },
      { $set: transformedData }
    );
    
    if (result.modifiedCount > 0) transformedCount++;
  }
  
  console.log(`Transformed ${transformedCount} documents`);
} 