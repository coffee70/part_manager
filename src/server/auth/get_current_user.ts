'use server'
import { getCurrentSession } from "./get_current_session"

export async function getCurrentUser() {
    const { session, user } = await getCurrentSession();

    if (!session) {
        return null;
    }

    return user;
}