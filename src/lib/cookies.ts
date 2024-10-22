import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "auth_session";

export function setSessionTokenCookie(token: string, expiresAt: Date): void {
	cookies().set(SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		expires: expiresAt,
		path: "/"
	});
}

export function deleteSessionTokenCookie(): void {
	cookies().set(SESSION_COOKIE_NAME, "", {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 0,
		path: "/"
	});
}