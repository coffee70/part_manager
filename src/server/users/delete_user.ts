'use server'
import client from "@/lib/mongo/db";
import { UserDoc } from "@/types/collections";

export async function deleteUser({ _id }: { _id: string }) {
    const db = client.db("test");
    const users = db.collection<UserDoc>("users");

    await users.deleteOne({ _id });
}