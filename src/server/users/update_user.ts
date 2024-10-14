'use server'

import { validators } from "../validators/validators";
import { hash } from "@node-rs/argon2";
import client from "@/lib/mongo/db";
import { User, UserDoc } from "@/types/collections";


type Input = {
    user: User;
}

export async function updateUser(input: Input) {
    const { user } = validators.input<Input>(input);

    // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
    // keep in mind some database (e.g. mysql) are case insensitive
    if (
        typeof user.username !== "string" ||
        user.username.length < 3 ||
        user.username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(user.username)
    ) {
        throw new Error("Invalid username");
    }

    const db = client.db('test');
    const users = db.collection<UserDoc>('users');

    const userNameChanged = await users.findOne({ _id: user._id, username: { $ne: user.username } }) !== null;
    if (userNameChanged) {
        const usernameInUse = await users.findOne({ username: user.username }) !== null;
        if (usernameInUse) {
            throw new Error("Username already in use");
        }
    }

    if (user.password.length > 0) {
        if (user.password.length < 6 || user.password.length > 255) {
            throw new Error("Invalid password");
        }

        const passwordHash = await hash(user.password, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        await users.updateOne({ _id: user._id }, { $set: { password_hash: passwordHash } });
    }

    await users.updateOne({ _id: user._id }, {
        $set: {
            name: user.name,
            username: user.username,
            title: user.title,
            role: user.role,
        }
    });
}