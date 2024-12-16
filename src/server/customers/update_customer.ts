'use server'
import { Customer } from "@/types/collections"
import { getCurrentSession } from "../auth/get_current_session";
import { validators } from "../validators/validators";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

type Input = {
    customer: Customer;
}

export async function updateCustomer(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { customer } = validators.input<Input>(input);

    const customersCollection = db.collection('customers');

    await customersCollection.updateOne(
        {
            _id: new ObjectId(customer._id)
        },
        {
            $set: {
                name: customer.name,
                notes: customer.notes,
                values: customer.values,
                updatedAt: new Date(),
                updatedById: user._id
            }
        });
}