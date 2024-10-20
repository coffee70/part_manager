'use server'
import { Commentable, SectionCollection, UserDoc } from "@/types/collections";
import { z } from "zod";
import { validators } from "../validators/validators";
import client from "@/lib/mongo/db";
import { ObjectId } from "mongodb";

const OutputSchema = z.object({
    comments: z.array(z.object({
        _id: z.string(),
        text: z.string(),
        updatedAt: z.string(),
        user: z.object({
            name: z.string(),
        }),
    }))
})

const InputSchema = z.object({
    id: z.string().nullable().optional(),
    collection: z.custom<SectionCollection>(),
})

export async function getComments(input: z.infer<typeof InputSchema>) {
    const { id, collection: _collection } = validators.input<z.infer<typeof InputSchema>>(input);

    if (!id) {
        throw new Error("id is required");
    }

    const db = client.db('test');
    const collection = db.collection<Commentable>(_collection);
    const document = await collection.findOne({ _id: new ObjectId(id) });

    if (!document) {
        throw new Error("document not found");
    }

    const userCollection = db.collection<UserDoc>('users');
    const comments = await Promise.all(document.comments.map(async comment => {
        const user = await userCollection.findOne({ _id: comment.userId });

        return {
            ...comment,
            user: {
                name: user?.name || "Unknown",
            }
        }
    }))

    const serialized = JSON.parse(JSON.stringify(comments));

    return validators.output<z.infer<typeof OutputSchema>>({
        comments: serialized,
    })
}