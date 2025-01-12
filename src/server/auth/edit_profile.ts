'use server'

import { db } from "@/lib/db";
import { UserDoc } from "@/types/collections";
import { z } from "zod"

const InputSchema = z.object({
    _id: z.string().optional(),
    name: z.string(),
    username: z.string(),
    title: z.string(),
})

export async function editProfile(input: z.input<typeof InputSchema>) {
    const { _id, name, username, title } = InputSchema.parse(input);
    if (!_id) throw new Error('Invalid user id');

    // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
    // keep in mind some database (e.g. mysql) are case insensitive
    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        throw new Error("Invalid username");
    }

    const users = db.collection<UserDoc>('users');

    const userNameChanged = await users.findOne({ _id, username: { $ne: username } }) !== null;
    if (userNameChanged) {
        const usernameInUse = await users.findOne({ username: username }) !== null;
        if (usernameInUse) {
            throw new Error("Username already in use");
        }
    }

    await users.updateOne({ _id }, {
        $set: {
            name,
            username,
            title,
        }
    })
}