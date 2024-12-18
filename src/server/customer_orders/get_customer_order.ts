'use server'
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { CustomerOrderDoc, CustomerDoc, Priority } from "@/types/collections";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { getAttachment } from "../attachments/get_attachment";

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
        base64: z.string(),
        type: z.string()
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

    const attachments = await Promise.all(
        customerOrder.attachments?.map(async (attachment) => {
            const blob = await getAttachment({ _id: attachment._id.toString() });
            const arrayBuffer = await blob.arrayBuffer();
            const base64String = Buffer.from(arrayBuffer).toString('base64');

            return {
                _id: attachment._id.toString(),
                name: attachment.filename,
                base64: base64String,
                type: blob.type
            };
        }) || []
    );

    const res = {
        ...customerOrder,
        _id: customerOrder._id.toString(),
        customer: {
            ...customer,
            _id: customer._id.toString(),
        },
        attachments,
    };

    return OutputSchema.parse(res);
}
