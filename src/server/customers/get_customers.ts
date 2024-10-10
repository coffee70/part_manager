'use server'
import client from "@/lib/mongo/db"
import { Customer } from "@/types/collections"

export async function getCustomers() {
    const db = client.db('test')
    const collection = db.collection<Customer>('customers')
    const customers = await collection.find().toArray()
    return customers
}