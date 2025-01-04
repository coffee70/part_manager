'use server'
import { db } from "@/lib/db"
import { getCurrentSession } from "../auth/get_current_session";
import { z } from "zod";

const OutputSchema = z.array(z.object({
    _id: z.string(),
    name: z.string(),
    username: z.string(),
    title: z.string(),
    role: z.enum(['admin', 'user']),
}))

export async function getUsers() {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const users = db.collection('users');
    const result = await users.find().toArray();
    const serialized = JSON.parse(JSON.stringify(result));
    return OutputSchema.parse(serialized);
}