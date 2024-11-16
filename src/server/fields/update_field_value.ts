'use server'
import { db } from "@/lib/mongo/db"
import { ObjectId } from "mongodb"
import { Valuable, SectionCollection } from "@/types/collections"
import { z } from "zod"
import { getCurrentSession } from "../auth/get_current_session"

type Input = {
    modelId: string | null;
    fieldId: string;
    sectionCollection: SectionCollection;
    value?: string | string[];
}

export async function updateFieldValue(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { data, success, error } = z.custom<Input>().safeParse(input)
    if (!success) {
        throw new Error(error.message)
    }
    const { modelId, fieldId, sectionCollection, value } = data
    if (!modelId) throw new Error('Cannot update field value without a model id')
    if (!value) return

    const collection = db.collection<Valuable>(sectionCollection)

    await collection.updateOne(
        { 
            _id: new ObjectId(modelId) 
        }, 
        { 
            $set: { 
                [`values.${fieldId}`]: value,
                updatedAt: new Date(),
                updatedById: user._id
            }
        }
    );
}