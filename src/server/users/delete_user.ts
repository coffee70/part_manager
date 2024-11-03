'use server'
import { db } from "@/lib/mongo/db";
import { UserDoc } from "@/types/collections";

export async function deleteUser({ _id }: { _id: string }) {
    const users = db.collection<UserDoc>("users");

    await users.deleteOne({ _id });
}