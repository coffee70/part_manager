'use server'
import client from "@/lib/mongo/db";
import { ObjectId } from "mongodb";
import { Customer, CustomerOrder, FieldType } from "@/types/collections";
import { getFieldValues } from "@/server/customer_orders/fields/get_field_values";
import { z } from "zod";
import { redirect } from "next/navigation";

type Output = {
    _id: string;
    number: string;
    customerId: string;
    attachments: {
        name: string;
        url: string;
    }[];
    sections: {
        _id: string;
        name: string;
        fields: {
            _id: string;
            name: string;
            type: FieldType;
            options?: string[];
            multiple?: boolean;
            creative?: boolean;
            value?: string | string[];
        }[];
    }[];
    customer: {
        _id: string;
        name: string;
    };
}

type Input = {
    _id?: string | null;
}

export async function getCustomerOrder({ _id }: Input): Promise<Output> {

    const db = client.db('test')
    const customerOrdersCollection = db.collection<CustomerOrder>('customerOrders')
    const customersCollection = db.collection<Customer>('customers')

    // if no id is provided, redirect to the first customer order so the URL is formed correctly
    // since alot of frontend functionality relies on the id being present in the URL
    if (!_id) {
        const customerOrder = await customerOrdersCollection.findOne();
        if (!customerOrder) {
            throw new Error('No customer orders found');
        }

        _id = customerOrder._id.toString();

        redirect(`/customer-orders/?id=${_id}`);
    }

    const customerOrder = await customerOrdersCollection.findOne({ _id: new ObjectId(_id) })
    
    if (!customerOrder) {
        throw new Error(`Customer Order with id ${_id} not found`);
    }

    const sections = await getFieldValues({ customerOrderId: customerOrder._id.toString() })

    const customer = await customersCollection.findOne({ _id: new ObjectId(customerOrder.customerId) })

    if (!customer) {
        throw new Error(`Customer with id ${customerOrder.customerId} not found`);
    }

    const res = {
        ...customerOrder,
        customer: customer,
        attachments: customerOrder.attachments.map((attachment) => ({
            name: attachment.filename,
            url: process.env.FILE_GET_URL as string + attachment._id
        })),
        sections: sections
    };

    const serialized = JSON.parse(JSON.stringify(res));

    // validate the return value
    const { data: parsed, success, error } = z.custom<Output>().safeParse(serialized);

    if (!success) {
        throw new Error(`Failed to serialize response: ${error}`);
    }

    return parsed;
}
