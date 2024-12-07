'use server'
import { CommentableDoc, SectionCollection, UserDoc } from "@/types/collections";
import { z } from "zod";
import { validators } from "../validators/validators";
import { db } from "@/lib/mongo/db";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";

const OutputSchema = z.object({
    comments: z.array(z.object({
        _id: z.string(),
        text: z.string(),
        updatedAt: z.string(),
        user: z.object({
            name: z.string(),
        }),
        editable: z.boolean(),
        deletable: z.boolean(),
    }))
})

const InputSchema = z.object({
    id: z.string().nullable().optional(),
    collection: z.custom<SectionCollection>(),
})

export async function getComments(input: z.infer<typeof InputSchema>) {
    const { user: currentUser } = await getCurrentSession();
    if (!currentUser) throw new Error('Unauthorized');

    const { id, collection: _collection } = validators.input<z.infer<typeof InputSchema>>(input);

    if (!id) {
        throw new Error("id is required");
    }

    const collection = db.collection<CommentableDoc>(_collection);
    const document = await collection.findOne({ _id: new ObjectId(id) });

    if (!document) {
        throw new Error("document not found");
    }

    if (!document.comments) {
        return validators.output<z.infer<typeof OutputSchema>>({
            comments: [],
        })
    }

    const userCollection = db.collection<UserDoc>('users');
    const comments = await Promise.all(document.comments.map(async comment => {
        const user = await userCollection.findOne({ _id: comment.userId });

        return {
            ...comment,
            user: {
                name: user?.name || "Inactive",
            },
            editable: comment.userId === currentUser._id || currentUser.role === 'admin',
            deletable: comment.userId === currentUser._id || currentUser.role === 'admin',
        }
    }))

    const serialized = JSON.parse(JSON.stringify(comments));

    return validators.output<z.infer<typeof OutputSchema>>({
        comments: serialized,
    })
}