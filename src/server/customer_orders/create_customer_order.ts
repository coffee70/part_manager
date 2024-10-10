'use server'
import client from "@/lib/mongo/db"
import { Customer, CustomerOrder } from "@/types/collections"
import { validators } from "../validators/validators";

type Input = {
    customerOrder: Omit<CustomerOrder, 'customerId'> & { customerName: string };
}

export async function createCustomerOrder(input: Input) {
    const { customerOrder } = validators.input<Input>(input)

    const db = client.db('test')
    const customersCollection = db.collection<Customer>('customers')
    const customerOrdersCollection = db.collection<CustomerOrder>('customerOrders')

    let customerId: string;
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