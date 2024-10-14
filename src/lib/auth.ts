import client from "./mongo/db";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { webcrypto } from "crypto";
import { Lucia, User, Session } from "lucia";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { cache } from "react";

globalThis.crypto = webcrypto as Crypto;

const db = client.db("test");
const UserCollection = db.collection<LuciaUser>("users");
const SessionCollection = db.collection<LuciaSession>("sessions");

const adapter = new MongodbAdapter(SessionCollection, UserCollection);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			username: attributes.username
		};
	}
});

export const validateRequest = cache(
	async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return {
				user: null,
				session: null
			};
		}

		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {}
		return result;
	}
);

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
}

export interface LuciaUser {
    _id: string;
    username: string;
}

export interface LuciaSession {
    _id: string;
    expires_at: Date;
    user_id: string;
}