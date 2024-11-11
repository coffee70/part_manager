'use server'
import { db } from "@/lib/mongo/db"
import { CustomerDoc, UserDoc } from "@/types/collections"
import { getSearchParams, SearchParams } from "@/lib/search_params"

export async function getCustomers({
    searchParams
}: {
    searchParams: SearchParams
}) {
    const { updatedAt, search, sortBy, sortOrder } = getSearchParams(searchParams, 'customers');

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
        matchStage.name = { $regex: search, $options: 'i' }; // 'i' option makes the search case-insensitive
    }

    // sort
    const sortStage: any = {};
    if (sortBy) {
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const customers = await customersCollection
        .find(matchStage)
        .sort(sortStage)
        .toArray();

    const res = await Promise.all(customers.map(async customer => {
        const updatedBy = await usersCollection.findOne({ _id: customer.updatedById });

        return {
            _id: customer._id.toString(),
            name: customer.name,
            updatedAt: customer.updatedAt,
            updatedBy: updatedBy ? updatedBy.name : undefined
        }
    }));

    return res;
}