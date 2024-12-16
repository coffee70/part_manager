'use server'
import { db } from "@/lib/db"

export async function checkNewInstance() {
    const users = db.collection("users")
    const userCount = await users.countDocuments();
    return userCount === 0;
}