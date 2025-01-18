'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session"
import { FieldDoc, fieldtypes } from "@/types/collections";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { db } from "@/lib/db";
import { ObjectId, WithoutId } from "mongodb";

const InputSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, { message: 'Field name is required.' }),
    sectionId: z.string().min(1, { message: 'Section ID is required.' }),
    type: z.enum(fieldtypes),
    description: z.string(),
    multiple: z.boolean().optional(),
    creative: z.boolean().optional(),
    default: z.string().optional(),
    options: z.array(z.string()).optional(),
})

export async function upsertField(input: z.input<typeof InputSchema>): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const validation = validate(InputSchema, input);
    if (!validation.success) return validation;

    const { _id, ...field } = validation.data;

    const fields = db.collection<WithoutId<FieldDoc>>('fields');

    if (_id) {
        await fields.updateOne({ _id: new ObjectId(_id) }, {
            $set: field
        })
    }
    else {
        await fields.insertOne(field)
    }

    return { success: true }
}