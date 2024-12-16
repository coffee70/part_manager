'use server'
import { db } from "@/lib/db";
import { getSearchParams, SearchParams } from "@/lib/search_params"
import { PartDoc, UserDoc } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";

export async function getParts({
    searchParams
}: {
    searchParams: SearchParams
}) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');
    
    const { updatedAt, search, sortBy, sortOrder } = getSearchParams(searchParams, 'parts');

    const partsCollection = db.collection<PartDoc>('parts');
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

    // sort
    const sortStage: any = {};
    if (sortBy) {
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const parts = await partsCollection
        .find(matchStage)
        .sort(sortStage)
        .toArray();

    const res = await Promise.all(parts.map(async part => {
        const updatedBy = await usersCollection.findOne({ _id: part.updatedById });

        return {
            _id: part._id.toString(),
            number: part.number,
            updatedAt: part.updatedAt,
            updatedBy: updatedBy ? updatedBy.name : undefined
        }
    }));

    return res;
}