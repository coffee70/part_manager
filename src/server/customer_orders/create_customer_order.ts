'use server'
import { db } from "@/lib/db"
import { Create, CustomerOrder, CustomerOrderDoc } from "@/types/collections"
import { validators } from "../validators/validators";
import { getCurrentSession } from "../auth/get_current_session";
import { WithoutId } from "mongodb";

type Input = {
    customerOrder: Omit<Create<CustomerOrder>, 'customerId'> & { customerName: string | undefined };
}

export async function createCustomerOrder(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized')

    const { customerOrder } = validators.input<Input>(input)

    const customersCollection = db.collection('customers')
    const customerOrdersCollection = db.collection<WithoutId<CustomerOrderDoc>>('customerOrders')

    let customerId: string;
    if (customerOrder.customerName === undefined || customerOrder.customerName === '') {
        throw new Error('Customer name is required')
    }
    const customer = await customersCollection.findOne({ name: customerOrder.customerName })
    if (!customer) {
        const { insertedId } = await customersCollection.insertOne({
            name: customerOrder.customerName,
            notes: "",
            values: {},
            attachments: [],
            comments: [],
            updatedAt: new Date(),
            updatedById: user._id
        })
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
        updatedAt: new Date(),
        updatedById: user._id
    })
}