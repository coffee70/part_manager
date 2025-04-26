'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { InstanceDoc } from "@/types/collections";

const InputSchema = z.object({
    routerId: z.string(),
    instanceId: z.string().nullable()
})

export async function getRouteFields(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { routerId, instanceId } = InputSchema.parse(input);
    if (!instanceId) throw new Error('Instance ID is required');
    
    // Get the collection using the routerId which is the collection name
    const collection = db.collection<InstanceDoc>(routerId);

    // Find the document and project only the route_fields
    const instance = await collection.findOne(
        { _id: new ObjectId(instanceId) },
        { projection: { route_fields: 1 } }
    );

    if (!instance || !instance.route_fields) {
        return [];
    }

    // Transform ObjectIds to strings for the frontend
    return instance.route_fields.map((field) => ({
        _id: field._id.toString(),
        name: field.name,
        fields: field.fields.map((f) => ({
            ...f,
            _id: f._id.toString()
        }))
    }));
} 