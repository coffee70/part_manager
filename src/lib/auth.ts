import { Role, SessionDoc, UserDoc } from "@/types/collections";
import client from "./mongo/db";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { webcrypto } from "crypto";
import { Lucia, User, Session } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import { Collection } from "mongodb";

globalThis.crypto = webcrypto as Crypto;

const db = client.db("test");
const UserCollection = db.collection("users") as Collection<UserDoc>;
const SessionCollection = db.collection("sessions") as Collection<SessionDoc>;

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
			username: attributes.username,
			role: attributes.role
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
	password_hash: string;
	title: string;
	role: Role;
	name: string;
}
