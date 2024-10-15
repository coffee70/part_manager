'use server'
import client from "@/lib/mongo/db"
import { Customer, Doc } from "@/types/collections"
import { validators } from "../validators/validators"

export async function getCustomers() {
    const db = client.db('test')
    const collection = db.collection('customers')
    const customers = await collection.find().toArray()
    const serialized = JSON.parse(JSON.stringify(customers))
    return validators.output<Customer[]>(serialized)
}