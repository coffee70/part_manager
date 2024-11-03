'use server'
import { db } from "@/lib/mongo/db"
import { CustomerDoc } from "@/types/collections"
import { WithoutId } from "mongodb"

export async function createCustomer({ customer }: { customer: WithoutId<CustomerDoc> }) {
    const customers = db.collection<WithoutId<CustomerDoc>>('customers')
    await customers.insertOne(customer)
}