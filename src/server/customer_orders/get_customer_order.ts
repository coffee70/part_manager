'use server'
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { CustomerOrderDoc, CustomerDoc, Priority } from "@/types/collections";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";

const OutputSchema = z.object({
    _id: z.string(),
    customerId: z.string(),
    number: z.string(),
    priority: z.custom<Priority>(),
    notes: z.string(),
    customer: z.object({
        _id: z.string(),
        name: z.string()
    }),
    attachments: z.array(z.object({
        _id: z.string(),
        name: z.string(),
        url: z.string()
    })),
    values: z.record(z.union([z.string(), z.array(z.string())]))
}).nullable();

type Output = z.infer<typeof OutputSchema>;

type Input = {
    _id?: string | null;
}

export async function getCustomerOrder({ _id }: Input): Promise<Output> {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const customerOrdersCollection = db.collection<CustomerOrderDoc>('customerOrders')
    const customersCollection = db.collection<CustomerDoc>('customers')

    // if no id is provided, redirect to the first customer order so the URL is formed correctly
    // since alot of frontend functionality relies on the id being present in the URL
    if (!_id) {
        const customerOrder = await customerOrdersCollection.findOne();
        if (!customerOrder) {
            return null;
        }

        _id = customerOrder._id.toString();

        redirect(`/customer-orders/?id=${_id}`);
    }

    const customerOrder = await customerOrdersCollection.findOne({ _id: new ObjectId(_id) })
    
    if (!customerOrder) {
        throw new Error(`Customer Order with id ${_id} not found`);
    }

    const customer = await customersCollection.findOne({ _id: new ObjectId(customerOrder.customerId) })

    if (!customer) {
        throw new Error(`Customer with id ${customerOrder.customerId} not found`);
    }

    const res = {
        ...customerOrder,
        customer: customer,
        attachments: customerOrder.attachments?.map((attachment) => ({
            _id: attachment._id.toString(),
            name: attachment.filename,
            url: process.env.FILE_GET_URL as string + attachment._id
        })) || [],
    };

    const serialized = JSON.parse(JSON.stringify(res));

    return OutputSchema.parse(serialized);
}
