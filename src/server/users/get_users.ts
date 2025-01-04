'use server'
import { db } from "@/lib/db"
import { User } from "@/types/collections";
import { validators } from "../validators/validators";
import { getCurrentSession } from "../auth/get_current_session";

type Output = Omit<User, 'password_hash'>[];

export async function getUsers() {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const users = db.collection('users');
    const result = await users.find().toArray();
    const serialized = JSON.parse(JSON.stringify(result));
    return validators.output<Output>(serialized);
}