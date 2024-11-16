'use server'
import { db } from "@/lib/mongo/db";
import { getSearchParams, SearchParams } from "@/lib/search_params";
import { SerialDoc, UserDoc } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";

export async function getSerials({
    searchParams
}: {
    searchParams: SearchParams
}) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { updatedAt, search, priority, sortBy, sortOrder } = getSearchParams(searchParams, 'serials');

    const serialsCollection = db.collection<SerialDoc>('serials');
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

    const serials = await serialsCollection
        .find(matchStage)
        .sort(sortStage)
        .toArray();

    const res = await Promise.all(serials.map(async serial => {
        const updatedBy = await usersCollection.findOne({ _id: serial.updatedById });

        return {
            _id: serial._id.toString(),
            number: serial.number,
            priority: serial.priority,
            notes: serial.notes,
            updatedAt: serial.updatedAt,
            updatedBy: updatedBy ? updatedBy.name : undefined
        }
    }));

    return res;
}