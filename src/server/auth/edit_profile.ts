'use server'
import { db } from "@/lib/db";
import { ActionState, validateAsync } from "@/lib/validators/server_actions";
import { UserDoc } from "@/types/collections";
import { z } from "zod"
import { getCurrentSession } from "./get_current_session";

const InputSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, { message: "Name is required." }),
    // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
    // keep in mind some database (e.g. mysql) are case insensitive
    username: z.string()
        .min(3, { message: "Username must be greater than 3 characters." })
        .max(31, { message: "Username must be less than 31 characters." })
        .refine((val) => /^[a-z0-9_-]+$/.test(val), { message: "Username can only consist of lowercase letters, 0-9, -, and _." }),
    title: z.string(),
}).refine(async (data) => {
    const existingUsername = await db.collection<UserDoc>('users').findOne({ username: data.username, _id: { $ne: data._id } });
    return existingUsername === null;
}, {
    message: 'Username already in use.',
    path: ['username']
})

export async function editProfile(input: z.input<typeof InputSchema>): Promise<ActionState<typeof InputSchema>> {
    const { user } = await getCurrentSession();
    if (!user) return { success: false, error: 'Unauthorized' }

    const validation = await validateAsync(InputSchema, input);
    if (!validation.success) return validation;

    const { _id, name, username, title } = validation.data;

    // since the _id is coming from the client app and not the session, 
    // we need to verify the user is updating their own profile
    if (!_id || user._id !== _id) return { success: false, error: 'Unauthorized' }

    const users = db.collection<UserDoc>('users');

    await users.updateOne({ _id }, {
        $set: {
            name,
            username,
            title,
        }
    })

    return { success: true }
}