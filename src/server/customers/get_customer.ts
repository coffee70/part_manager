'use server'
import { db } from "@/lib/mongo/db";
import { CustomerDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";

const OutputSchema = z.object({
    _id: z.string(),
    name: z.string(),
    notes: z.string(),
    attachments: z.array(z.object({
        _id: z.string(),
        name: z.string(),
        url: z.string()
    })),
    values: z.record(z.union([z.string(), z.array(z.string())]))
}).nullable();

export async function getCustomer({ _id }: { _id?: string | null }) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const customersCollection = db.collection<CustomerDoc>('customers');

    // if no id is provided, redirect to the first customer so the URL is formed correctly
    // since alot of frontend functionality relies on the id being present in the URL
    if (!_id) {
        const customer = await customersCollection.findOne();
        if (!customer) {
            return null;
        }

        _id = customer._id.toString();

        redirect(`/customers/?id=${_id}`);
    }

    const customer = await customersCollection.findOne({ _id: new ObjectId(_id) })

    if (!customer) {
        throw new Error(`Customer with id ${_id} not found`);
    }

    const res = {
        ...customer,
        attachments: customer.attachments?.map(attachment => ({
            _id: attachment._id.toString(),
            name: attachment.filename,
            url: process.env.FILE_GET_URL as string + attachment._id
        })) || []
    }

    const serialized = JSON.parse(JSON.stringify(res));

    return OutputSchema.parse(serialized);
}