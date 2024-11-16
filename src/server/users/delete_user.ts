'use server'
import { db } from "@/lib/mongo/db";
import { UserDoc } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";

export async function deleteUser({ _id }: { _id: string }) {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const users = db.collection<UserDoc>("users");

    await users.deleteOne({ _id });
}