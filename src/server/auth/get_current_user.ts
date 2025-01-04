'use server'
import { z } from "zod";
import { getCurrentSession } from "./get_current_session"

const OutputSchema = z.object({
    _id: z.string(),
    name: z.string(),
    username: z.string(),
    title: z.string(),
    role: z.enum(['admin', 'user']),
})

export async function getCurrentUser() {
    const { session, user } = await getCurrentSession();

    if (!session) {
        return null;
    }
    
    // this schema parses out the password field
    return OutputSchema.parse(user);
}