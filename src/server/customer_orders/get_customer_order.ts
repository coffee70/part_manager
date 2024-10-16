'use server'
import client from "@/lib/mongo/db";
import { ObjectId } from "mongodb";
import { CustomerOrderDoc, CustomerDoc, AttachableDoc, Priority } from "@/types/collections";
import { redirect } from "next/navigation";
import { z } from "zod";

const OutputSchema = z.object({
    customerId: z.string(),
    number: z.string(),
    priority: z.custom<Priority>(),
    notes: z.string(),
    customer: z.object({
        _id: z.string(),
        name: z.string()
    }),
    attachments: z.array(z.object({
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

    const db = client.db('test')
    const customerOrdersCollection = db.collection<CustomerOrderDoc & AttachableDoc>('customerOrders')
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
            name: attachment.filename,
            url: process.env.FILE_GET_URL as string + attachment._id
        })) || [],
    };

    const serialized = JSON.parse(JSON.stringify(res));

    const parsed = OutputSchema.parse(serialized);
    return parsed;
}
