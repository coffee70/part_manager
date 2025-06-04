'use server'
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session"
import { FieldDoc, FieldSchema } from "@/types/collections";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { db } from "@/lib/db";
import { ObjectId, WithoutId } from "mongodb";

const InputSchema = FieldSchema.extend({
    _id: z.string().optional(),
}).refine(data => {
    if (data.type === 'select') {
        if (data.options) return data.options.length > 0;
        else return false;
    }
    else return true;
}, {
    message: 'Select fields must have options.',
    path: ['options']
});;

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