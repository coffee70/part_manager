'use server'
import client from "@/lib/mongo/db";
import { ObjectId } from "mongodb";
import { Customer, CustomerOrder, Section, Field } from "@/types/collections";
import { getFieldValues } from "@/server/customer_orders/fields/get_field_values";
import { z } from "zod";
import { redirect } from "next/navigation";
import { validators } from "../validators/validators";

type Output = CustomerOrder & {
    customer: Customer;
    attachments: {
        name: string;
        url: string;
    }[];
} | null;

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
        })),
    };

    const serialized = JSON.parse(JSON.stringify(res));

    // validate the return value
    return validators.output<Output>(serialized);
}
