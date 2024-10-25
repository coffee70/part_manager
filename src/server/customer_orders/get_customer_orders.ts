'use server'
import { z } from 'zod';
import client from '@/lib/mongo/db';
import { CustomerDoc, CustomerOrder, CustomerOrderSortKeys, Priority } from '@/types/collections';
import { Document, ObjectId } from 'mongodb';

// schemas
const UpdatedAt = z.object({
    to: z.coerce.date().optional(),
    from: z.coerce.date().optional(),
});

export async function getCustomerOrders({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // pull out updatedAt
    const updatedAtJson = searchParams.updatedAt;
    if (Array.isArray(updatedAtJson)) {
        throw new Error("updatedAt must be a json string");
    }
    const updatedAtParsed = updatedAtJson ? JSON.parse(updatedAtJson) : undefined;
    const { data: updatedAt, error: updatedAtError } = UpdatedAt.optional().safeParse(updatedAtParsed);
    if (updatedAtError) {
        throw new Error("updatedAt must be a valid date range");
    }

    // pull out search
    let search = searchParams.search;
    if (Array.isArray(search)) {
        throw new Error("search must be a string");
    }


    // pull out priority
    const { data: priority, error: priorityError } = z.custom<Priority>().optional().safeParse(searchParams.priority);
    if (priorityError) {
        throw new Error("priority must be a valid priority");
    }

    const { data: sortBy, error: sortByError } = z.enum(CustomerOrderSortKeys).optional().safeParse(searchParams.sort_by);
    if (sortByError) {
        throw new Error("sortBy must be either 'number', 'updatedAt', or 'priority'");
    }

    // get sort_order
    const { data: sortOrder, error: sortOrderError } = z.enum(['asc', 'desc']).optional().safeParse(searchParams.sort_order);
    if (sortOrderError) {
        throw new Error("sortOrder must be either 'asc' or 'desc'");
    }

    const db = client.db('test');
    const customerOrdersCollection = db.collection<CustomerOrder>('customerOrders');
    const customersCollection = db.collection<CustomerDoc>('customers');

    // filters
    const matchStage: any = {};
    if (updatedAt) {
        matchStage.updatedAt = {
            $gte: updatedAt.from,
            $lte: updatedAt.to
        };
    }
    if (search) {
        matchStage.$text = { $search: search };
    }
    if (priority) {
        matchStage.priority = priority;
    }

    // sort
    const sortStage: any = {};
    if (sortBy) {
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const customerOrders = await customerOrdersCollection
        .find(matchStage)
        .sort(sortStage)
        .toArray();

    const res = await Promise.all(customerOrders.map(async order => {
        const customer = await customersCollection.findOne({ _id: new ObjectId(order.customerId) });

        if (!customer) {
            throw new Error(`Customer with id ${order.customerId} not found`);
        }

        return {
            _id: order._id.toString(),
            customer: {
                name: customer.name
            },
            number: order.number,
            priority: order.priority,
        };
    }));

    return res;
}