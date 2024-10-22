'use server'
import { cookies } from "next/headers";
import { validateSessionToken, type SessionValidationResult } from "@/lib/session";
/**
 * The Lucia documentation suggests to cache the result of getCurrentSession here:
 * https://lucia-auth.com/sessions/cookies/nextjs
 * However, I noticed that when I log in, the user is null when the function is 
 * cached, but correctly returns the user when it is not cached. I am not sure why
 * this is happening, but I will leave the code here for reference.
 */

// export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
// 	const token = cookies().get("session")?.value ?? null;
// 	if (token === null) {
// 		return { session: null, user: null };
// 	}
// 	const result = await validateSessionToken(token);
// 	return result;
// });

export async function getCurrentSession(): Promise<SessionValidationResult> {
    const token = cookies().get("auth_session")?.value ?? null;
    if (token === null) {
        return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
}