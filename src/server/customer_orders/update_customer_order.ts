'use server'
import { CustomerOrder } from "@/types/collections";
import { validators } from "../validators/validators";
import client from "@/lib/mongo/db";
import { ObjectId } from "mongodb";
import { getCurrentSession } from "../auth/get_current_session";

type Input = {
    customerOrder: Omit<CustomerOrder, 'customerId'> & { customerName: string | undefined };
}

export async function updateCustomerOrder(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const { customerOrder } = validators.input<Input>(input);

    const db = client.db('test');
    const customersCollection = db.collection('customers');
    const customerOrdersCollection = db.collection('customerOrders');

    let customerId: string;
    if (customerOrder.customerName === undefined) {
        throw new Error('Customer name is required');
    }
    const customer = await customersCollection.findOne({ name: customerOrder.customerName });
    if (!customer) {
        const { insertedId } = await customersCollection.insertOne({ name: customerOrder.customerName });
        customerId = insertedId.toString();
    } else {
        customerId = customer._id.toString();
    }

    await customerOrdersCollection.updateOne(
        {
            _id: new ObjectId(customerOrder._id)
        },
        {
            $set: {
                number: customerOrder.number,
                priority: customerOrder.priority,
                notes: customerOrder.notes,
                values: customerOrder.values,
                customerId: customerId,
                updatedAt: new Date(),
                updatedById: user._id
            }
        });
}