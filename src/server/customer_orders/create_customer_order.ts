'use server'
import client from "@/lib/mongo/db"
import { CustomerOrder } from "@/types/collections"
import { validators } from "../validators/validators";

type Input = {
    customerOrder: Omit<CustomerOrder, 'customerId'> & { customerName: string | undefined };
}

export async function createCustomerOrder(input: Input) {
    const { customerOrder } = validators.input<Input>(input)

    const db = client.db('test')
    const customersCollection = db.collection('customers')
    const customerOrdersCollection = db.collection('customerOrders')

    let customerId: string;
    if (customerOrder.customerName === undefined) {
        throw new Error('Customer name is required')
    }
    const customer = await customersCollection.findOne({ name: customerOrder.customerName })
    if (!customer) {
        const { insertedId } = await customersCollection.insertOne({ name: customerOrder.customerName })
        customerId = insertedId.toString()
    }
    else {
        customerId = customer._id.toString()
    }
    await customerOrdersCollection.insertOne({
        ...customerOrder,
        customerId: customerId
    })
}