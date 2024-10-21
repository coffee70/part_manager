'use server'
import client from "@/lib/mongo/db"
import { Create, CustomerOrder } from "@/types/collections"
import { validators } from "../validators/validators";
import { ObjectId } from "mongodb";

type Input = {
    customerOrder: Omit<Create<CustomerOrder>, 'customerId'> & { customerName: string | undefined };
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
        number: customerOrder.number,
        priority: customerOrder.priority,
        notes: customerOrder.notes,
        values: customerOrder.values,
        customerId: customerId,
        comments: [],
    })
}