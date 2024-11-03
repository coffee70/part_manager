import { SessionDoc, UserDoc } from "@/types/collections";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db } from "@/lib/mongo/db";

const users = db.collection<UserDoc>("users");
const sessions = db.collection<SessionDoc>("sessions");

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export function generateUserId(): string {
    const bytes = new Uint8Array(10);
    crypto.getRandomValues(bytes);
    const userId = encodeHexLowerCase(bytes);
    return userId;
}

export async function createSession(token: string, userId: string): Promise<SessionDoc> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
    const session: SessionDoc = {
        _id: sessionId,
        user_id: userId,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    }
    await sessions.insertOne(session);
    return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
    const session = await sessions.findOne({ _id: sessionId });
    if (!session) {
        return { session: null, user: null };
    }
    const user = await users.findOne({ _id: session.user_id });
    if (!user) {
        return { session: null, user: null };
    }
    if (Date.now() >= session.expires_at.getTime()) {
        await sessions.deleteOne({ _id: session._id });
        return { session: null, user: null };
    }
    if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await sessions.updateOne({ _id: session._id }, { $set: { expires_at: session.expires_at } });
    }
    return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await sessions.deleteOne({ _id: sessionId });
}

export type SessionValidationResult =
	| { session: SessionDoc; user: UserDoc }
	| { session: null; user: null };