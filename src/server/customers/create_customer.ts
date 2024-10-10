'use server'
import client from "@/lib/mongo/db"
import { Customer } from "@/types/collections"
import { WithoutId } from "mongodb"

export async function createCustomer({ customer }: { customer: Customer }) {
    const db = client.db('test')
    const customers = db.collection<Customer>('customers')
    await customers.insertOne(customer)
}