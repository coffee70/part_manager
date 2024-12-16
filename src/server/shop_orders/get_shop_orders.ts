'use server'
import { db } from "@/lib/db";
import { getSearchParams, SearchParams } from "@/lib/search_params"
import { ShopOrderDoc, UserDoc } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";

export async function getShopOrders({
    searchParams
}: {
    searchParams: SearchParams
}) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { updatedAt, search, priority, sortBy, sortOrder } = getSearchParams(searchParams, 'shopOrders');

    const shopOrdersCollection = db.collection<ShopOrderDoc>('shopOrders');
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

    const shopOrders = await shopOrdersCollection
        .find(matchStage)
        .sort(sortStage)
        .toArray();

    const res = await Promise.all(shopOrders.map(async order => {
        const updatedBy = await usersCollection.findOne({ _id: order.updatedById });

        return {
            _id: order._id.toString(),
            number: order.number,
            priority: order.priority,
            notes: order.notes,
            updatedAt: order.updatedAt,
            updatedBy: updatedBy ? updatedBy.name : undefined
        }
    }));

    return res;
}