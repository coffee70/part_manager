'use server'
import { db } from "@/lib/mongo/db"
import { Create, Customer, CustomerDoc } from "@/types/collections"
import { WithoutId } from "mongodb"
import { getCurrentSession } from "../auth/get_current_session"
import { validators } from "../validators/validators"

type Input = {
    customer: Create<Customer>
}

export async function createCustomer(input: Input) {
    const { user } = await getCurrentSession()
    if (!user) {
        throw new Error('Unauthorized')
    }

    const { customer } = validators.input<Input>(input)

    const customersCollection = db.collection<WithoutId<CustomerDoc>>('customers')

    await customersCollection.insertOne({
        name: customer.name,
        notes: customer.notes,
        values: customer.values,
        attachments: [],
        comments: [],
        updatedAt: new Date(),
        updatedById: user._id
    })
}