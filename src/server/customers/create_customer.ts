'use server'
import client from "@/lib/mongo/db"
import { CustomerDoc } from "@/types/collections"
import { WithoutId } from "mongodb"

export async function createCustomer({ customer }: { customer: WithoutId<CustomerDoc> }) {
    const db = client.db('test')
    const customers = db.collection<WithoutId<CustomerDoc>>('customers')
    await customers.insertOne(customer)
}