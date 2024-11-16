'use server'
import { db } from '@/lib/mongo/db';
import { CustomerDoc, CustomerOrderDoc, UserDoc } from '@/types/collections';
import { ObjectId } from 'mongodb';
import { getSearchParams, SearchParams } from '@/lib/search_params';
import { getCurrentSession } from '../auth/get_current_session';

export async function getCustomerOrders({
    searchParams
} : {
    searchParams: SearchParams
}) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { updatedAt, search, priority, sortBy, sortOrder } = getSearchParams(searchParams, 'customerOrders');

    const customerOrdersCollection = db.collection<CustomerOrderDoc>('customerOrders');
    const customersCollection = db.collection<CustomerDoc>('customers');
    const usersCollection = db.collection<UserDoc>('users');

    // filters
    const matchStage: any = {};
    if (updatedAt) {
        matchStage.updatedAt = {
            $gte: updatedAt.from,
            $lte: updatedAt.to
        };
    }

    if (search) {
        matchStage.number = { $regex: search, $options: 'i' }; // 'i' option makes the search case-insensitive
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
        const updatedBy = await usersCollection.findOne({ _id: order.updatedById });

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
            updatedAt: order.updatedAt,
            updatedBy: updatedBy ? updatedBy.name : undefined
        };
    }));

    return res;
}