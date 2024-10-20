'use server'
import { validateRequest } from "@/lib/auth";

export async function getCurrentUser() {
    const { user } = await validateRequest();
    return user;
}