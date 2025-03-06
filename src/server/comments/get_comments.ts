'use server'
import { CommentableDoc, contexts, UserDoc } from "@/types/collections";
import { z } from "zod";
import { validators } from "../validators/validators";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";
import { isCommentable } from "../contexts/is_commentable";

const OutputSchema = z.object({
    comments: z.array(z.object({
        _id: z.custom<ObjectId>().transform(value => value.toString()),
        text: z.string(),
        updatedAt: z.date(),
        user: z.object({
            name: z.string(),
        }),
        editable: z.boolean(),
        deletable: z.boolean(),
    }))
})

const InputSchema = z.object({
    context: z.enum(contexts),
    id: z.string(),
    instanceId: z.string().nullable().optional(),
})

export async function getComments(input: z.infer<typeof InputSchema>) {
    const { user: currentUser } = await getCurrentSession();
    if (!currentUser) throw new Error('Unauthorized');

    const { context, id, instanceId } = validators.input<z.infer<typeof InputSchema>>(input);
    if (!instanceId) throw new Error("id is required");

    if (!await isCommentable({ context, id })) {
        return OutputSchema.parse({ comments: [] });
    }
    
    const collection = db.collection<CommentableDoc>(id);
    const document = await collection.findOne({ _id: new ObjectId(instanceId) });
    if (!document) throw new Error("document not found");

    if (!document.comments) {
        return OutputSchema.parse({ comments: [] });
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

    return OutputSchema.parse({ comments });
}