'use server'
import client from "@/lib/mongo/db"
import { Customer } from "@/types/collections"
import { WithoutId } from "mongodb"

export async function createCustomer({ customer }: { customer: WithoutId<Customer> }) {
    const db = client.db('test')
    const customers = db.collection<WithoutId<Customer>>('customers')
    const res = await customers.insertOne(customer)
    return res.insertedId.toString()
}