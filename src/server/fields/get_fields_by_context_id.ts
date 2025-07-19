'use server'
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"
import { 
    contexts,
    SectionDoc,
    FieldDoc
} from "@/types/collections";
import { db } from "@/lib/db";

const InputSchema = z.object({
    context: z.enum(contexts),
    contextId: z.string().min(1, { message: 'Context ID is required.' }),
})

export async function getFieldsByContextId(input: z.input<typeof InputSchema>) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { context, contextId } = InputSchema.parse(input);

    try {
        // Step 1: Find all sections for the given context and contextId
        const sectionsCollection = db.collection<SectionDoc>('sections');
        const sections = await sectionsCollection.find({
            [context === 'models' ? 'modelId' : 'routerId']: contextId
        }).toArray();

        // Step 2: Extract all section IDs
        const sectionIds = sections.map(section => section._id.toString());

        // If no sections found, return empty array
        if (sectionIds.length === 0) {
            return [];
        }

        // Step 3: Find all fields whose sectionId is in the list of section IDs
        const fieldsCollection = db.collection<FieldDoc>('fields');
        const fields = await fieldsCollection.find({
            sectionId: { $in: sectionIds }
        }).toArray();

        // Step 4: Transform the fields to convert ObjectId to string
        return fields.map(field => ({
            ...field,
            _id: field._id.toString()
        }));

    } catch (error) {
        console.error('Error retrieving fields by context:', error);
        throw new Error('Failed to retrieve fields by context');
    }
} 