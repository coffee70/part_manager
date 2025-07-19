import { ObjectId } from "mongodb";

// Type to represent how ObjectIds get serialized to strings
type SerializeObjectIds<T> = T extends ObjectId
    ? string
    : T extends Array<infer U>
    ? Array<SerializeObjectIds<U>>
    : T extends object
    ? { [K in keyof T]: SerializeObjectIds<T[K]> }
    : T;

// Comprehensive function to convert ALL ObjectIds to strings
export function serializeObjectIds<T>(obj: T): SerializeObjectIds<T> {
    if (obj === null || obj === undefined) {
        return obj as unknown as SerializeObjectIds<T>;
    }
    
    // Handle ObjectId instances
    if (obj instanceof ObjectId) {
        return obj.toString() as unknown as SerializeObjectIds<T>;
    }
    
    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(serializeObjectIds) as unknown as SerializeObjectIds<T>;
    }
    
    // Handle objects (including nested ones)
    if (typeof obj === 'object') {
        const serialized: any = {};
        for (const [key, value] of Object.entries(obj)) {
            serialized[key] = serializeObjectIds(value);
        }
        return serialized as unknown as SerializeObjectIds<T>;
    }
    
    // Return primitive values as-is
    return obj as unknown as SerializeObjectIds<T>;
}