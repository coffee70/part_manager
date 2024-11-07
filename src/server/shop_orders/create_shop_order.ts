'use server'
import { Create, ShopOrder } from "@/types/collections"
import { getCurrentSession } from "../auth/get_current_session";
import { validators } from "../validators/validators";
import { db } from "@/lib/mongo/db";

type Input = {
    shopOrder: Create<ShopOrder>;
}

export async function createShopOrder(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) {
        throw new Error('Unauthorized')
    }

    const { shopOrder } = validators.input<Input>(input)

    const shopOrdersCollection = db.collection('shopOrders')

    await shopOrdersCollection.insertOne({
        number: shopOrder.number,
        priority: shopOrder.priority,
        notes: shopOrder.notes,
        values: shopOrder.values,
        attachments: [],
        comments: [],
        updatedAt: new Date(),
        updatedById: user._id
    })
}