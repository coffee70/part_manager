'use server'

import client from "@/lib/mongo/db";
import { Create, User, UserDoc } from "@/types/collections";
import { validators } from "../validators/validators";
import { hash } from "@node-rs/argon2";
import { generateUserId } from "@/lib/session";


type Input = {
    user: Create<User>;
}

export async function createUser(input: Input) {
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
	if (typeof user.password !== "string" || user.password.length < 6 || user.password.length > 255) {
		throw new Error("Invalid password");
	}

    const passwordHash = await hash(user.password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
    const userId = generateUserId();

    const db = client.db('test');
    const users = db.collection<UserDoc>('users');

    const usernameInUse = await users.findOne({ username: user.username }) !== null;
    if (usernameInUse) {
        throw new Error("Username already in use");
    }

    await users.insertOne({
        _id: userId,
        name: user.name,
        username: user.username,
        title: user.title,
        role: user.role,
        password_hash: passwordHash,
    });
}