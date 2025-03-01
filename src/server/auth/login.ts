'use server'
import { db } from "@/lib/db";
import { validators } from "../validators/validators";
import { ServerActionState, UserDoc } from "@/types/collections";
import { verify } from "@node-rs/argon2";
import { createSession, generateSessionToken } from "@/lib/session";
import { setSessionTokenCookie } from "@/lib/cookies";
import { redirect } from "next/navigation";
import { router } from "@/lib/url";

const AUTH_ERROR_MESSAGE = "Incorrect username or password.";

type Input = {
    username: string;
    password: string;
}

export async function login(input: Input): Promise<ServerActionState> {
    const { username, password } = validators.input<Input>(input);

    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        return { success: false, error: AUTH_ERROR_MESSAGE };
    }
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return { success: false, error: AUTH_ERROR_MESSAGE };
    }
    
    const existingUser = await db.collection<UserDoc>("users").findOne({ username });
    if (!existingUser) {
        // NOTE:
        // Returning immediately allows malicious actors to figure out valid usernames from response times,
        // allowing them to only focus on guessing passwords in brute-force attacks.
        // As a preventive measure, you may want to hash passwords even for invalid usernames.
        // However, valid usernames can be already be revealed with the signup page among other methods.
        // It will also be much more resource intensive.
        // Since protecting against this is non-trivial,
        // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
        // If usernames are public, you may outright tell the user that the username is invalid.
        return { success: false, error: AUTH_ERROR_MESSAGE };
    }

    const validPassword = await verify(existingUser.password_hash, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    if (!validPassword) {
        return { success: false, error: AUTH_ERROR_MESSAGE };
    }

    const token = generateSessionToken();
    const session = await createSession(token, existingUser._id); 
    setSessionTokenCookie(token, session.expires_at);
    redirect(router().base());
}   