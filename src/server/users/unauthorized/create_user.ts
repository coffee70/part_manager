'use server'
import { validators } from "@/server/validators/validators";
import { Create, ServerActionState, User, UserDoc } from "@/types/collections";
import { hash } from "@node-rs/argon2";
import { createSession, generateSessionToken, generateUserId } from "@/lib/session";
import { db } from "@/lib/db";
import { checkNewInstance } from "@/server/auth/check_new_instance";
import { setSessionTokenCookie } from "@/lib/cookies";
import { redirect } from "next/navigation";

type Input = {
    user: Create<User> & { password: string };
}

export async function unauthorized_createUser(input: Input): Promise<ServerActionState> {

    // only use this function on new instance
    const isNewInstance = await checkNewInstance();
    if (!isNewInstance) {
        return { success: false, error: "Unauthorized" };
    }

    const { user } = validators.input<Input>(input);

    // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
    // keep in mind some database (e.g. mysql) are case insensitive
    if (
        typeof user.username !== "string" ||
        user.username.length < 3 ||
        user.username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(user.username)
    ) {
        return { success: false, error: "Invalid username" };
    }
    if (typeof user.password !== "string" || user.password.length < 6 || user.password.length > 255) {
        return { success: false, error: "Invalid password" };
    }

    const passwordHash = await hash(user.password, {
        // recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    const userId = generateUserId();

    const users = db.collection<UserDoc>('users');

    const usernameInUse = await users.findOne({ username: user.username }) !== null;
    if (usernameInUse) {
        return { success: false, error: "Username already in use" };
    }

    await users.insertOne({
        _id: userId,
        name: user.name,
        username: user.username,
        title: user.title,
        role: user.role,
        password_hash: passwordHash,
    });

    const token = generateSessionToken();
    const session = await createSession(token, userId);
    setSessionTokenCookie(token, session.expires_at);
    redirect("/");
}