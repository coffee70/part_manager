'use server'
import { db } from "@/lib/mongo/db"
import { Customer } from "@/types/collections"
import { validators } from "../validators/validators"

export async function getCustomers() {
    const collection = db.collection('customers')
    const customers = await collection.find().toArray()
    const serialized = JSON.parse(JSON.stringify(customers))
    return validators.output<Customer[]>(serialized)
}