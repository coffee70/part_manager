'use server'
import { z } from 'zod';
import client from '@/lib/mongo/db';
import { Customer, CustomerOrder } from '@/types/collections';
import { ObjectId } from 'mongodb';

// schemas
const UpdatedAt = z.object({
    to: z.coerce.date(),
    from: z.coerce.date(),
});

const QueryResultSchema = z.custom<CustomerOrder[]>();

export async function getCustomerOrders({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    // build whereObject
    // pull out statusId
    let statusIdJson = searchParams.statusId;
    if (Array.isArray(statusIdJson)) {
        throw new Error("statusId must be a json string");
    }

    let statusIds: ObjectId[] = [];

    if (statusIdJson) {
        statusIds = JSON.parse(statusIdJson);

        const validation = z.array(z.string()).safeParse(statusIds);
        if (!validation.success) {
            throw new Error("statusId is not a valid array of numbers");
        } else {
            statusIds = validation.data.map(id => new ObjectId(id));
        }
    }

    // pull out updatedAt
    // Assuming searchParams is an object where updatedAt is one of the properties
    // and UpdatedAt is a Zod schema for validation

    // Extract updatedAt from searchParams
    let updatedAtJson = searchParams.updatedAt;

    // Check if updatedAtJson is an array, throw an error if true
    if (Array.isArray(updatedAtJson)) {
        throw new Error("updatedAt must be a json string");
    }

    // Initialize a variable to hold the parsed updatedAt object
    let updatedAt;

    // Parse updatedAtJson into an object if it's not undefined
    if (updatedAtJson) {
        updatedAt = JSON.parse(updatedAtJson);

        // Validate the parsed updatedAt object with the UpdatedAt Zod schema
        const validation = UpdatedAt.safeParse(updatedAt);
        if (!validation.success) {
            // If validation fails, throw an error
            throw new Error("updatedAt is not a valid date");
        } else {
            // If validation succeeds, updatedAt contains the parsed object
            updatedAt = validation.data;
        }
    }

    // pull out search
    let search = searchParams.search;
    if (Array.isArray(search)) {
        throw new Error("search must be a string");
    }

    // build orderByObject
    // get sort_by
    let sortBy = searchParams.sortBy;
    if (sortBy) {
        let validation = z.enum(['number', 'updatedAt']).safeParse(sortBy);
        if (!validation.success) {
            throw new Error("sortBy must be either 'number' or 'updatedAt'");
        }
        sortBy = validation.data;
    }
    // get sort_order
    let sortOrder = searchParams.sortOrder;
    if (sortOrder) {
        let validation = z.enum(['asc', 'desc']).safeParse(sortOrder);
        if (!validation.success) {
            throw new Error("sortOrder must be either 'asc' or 'desc'");
        }
        sortOrder = validation.data;
    }

    const db = client.db('test');
    const customerOrdersCollection = db.collection<CustomerOrder>('customerOrders');
    const customersCollection = db.collection<Customer>('customers');

    const matchStage: any = {};

    // Add statusId condition if it's not empty
    if (statusIds && statusIds.length > 0) {
        matchStage.statusId = { $in: statusIds };
    }

    // Add updatedAt condition if it's defined
    if (updatedAt) {
        matchStage.updatedAt = {
            $gte: updatedAt.from,
            $lte: updatedAt.to
        };
    }

    // Add $text search condition if search is defined
    if (search) {
        matchStage.$text = { $search: search };
    }

    const customerOrders = await customerOrdersCollection.find(matchStage).toArray();

    return await Promise.all(customerOrders.map(async order => {
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
            updatedAt: order.updatedAt,
        };
    }));
}