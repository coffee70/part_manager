'use server'
import { roles, UserDoc } from "@/types/collections";
import { checkNewInstance } from "@/server/auth/check_new_instance";
import { getCurrentSession } from "@/server/auth/get_current_session";
import { z } from "zod";
import { ActionState, validateAsync } from "@/lib/validators/server_actions";
import { hash } from "@node-rs/argon2";
import { db } from "@/lib/db";
import { createSession, generateSessionToken, generateUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import { setSessionTokenCookie } from "@/lib/cookies";
import { router } from "@/lib/url";

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
    role: z.enum(roles),
    password: z.string()
        .max(255, { message: "Password must be less than 255 characters." })
}).refine(data =>
    // if no id is provided, the user is creating a new user, so there must be a password
    // if there is some length to the password, it is assumed the user is changing the password
    !data._id || data.password.length > 0
        ? data.password.length > 6
        : true,
    {
        message: "Password must be greater than 6 characters.",
        path: ["password"]
    }
).refine(async data => {
    const existingUsername = await db.collection<UserDoc>('users').findOne({ username: data.username, _id: { $ne: data._id } });
    return existingUsername === null;
}, {
    message: 'Username already in use.',
    path: ['username']
})

export async function upsertUser(
    input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema> | void> {
    const isNewInstance = await checkNewInstance();
    if (!isNewInstance) {
        const { user: currentUser } = await getCurrentSession();
        if (!currentUser || currentUser.role !== 'admin') return { success: false, error: 'Unauthorized' };
    }

    const validation = await validateAsync(InputSchema, input)
    if (!validation.success) return validation

    const { _id, ...user } = validation.data
    const users = db.collection<UserDoc>('users')

    const passwordHash = await hash(user.password, {
        // recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    })

    // if the user is updating a user and a password is provided, update the password
    if (_id && user.password.length > 0) {
        await users.updateOne({ _id }, { $set: { password_hash: passwordHash } });
    }

    if (_id) {
        await users.updateOne({ _id }, {
            $set: {
                name: user.name,
                username: user.username,
                title: user.title,
                role: user.role,
            }
        })
    } else {
        const userId = generateUserId();
        await users.insertOne({
            _id: userId,
            name: user.name,
            username: user.username,
            title: user.title,
            role: user.role,
            password_hash: passwordHash,
        })
        if (isNewInstance) {
            const token = generateSessionToken();
            const session = await createSession(token, userId);
            setSessionTokenCookie(token, session.expires_at);
            redirect(router().base());
        }
    }

    return { success: true }
}