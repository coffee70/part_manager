'use server'
import { db } from "@/lib/mongo/db"

export async function checkNewInstance() {
    const users = db.collection("users")
    const userCount = await users.countDocuments();
    return userCount === 0;
}