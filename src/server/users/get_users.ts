'use server'

import client from "@/lib/mongo/db"
import { User } from "@/types/collections";
import { validators } from "../validators/validators";

type Output = Omit<User, 'password_hash'>[];

export async function getUsers() {
    const db = client.db('test');
    const users = db.collection('users');
    const result = await users.find().toArray();
    const serialized = JSON.parse(JSON.stringify(result));
    const valid = validators.output<Output>(serialized);
    console.log(valid);
    return valid;
}