'use server'
import { ShopOrder } from "@/types/collections"
import { getCurrentSession } from "../auth/get_current_session";
import { validators } from "../validators/validators";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

type Input = {
    shopOrder: ShopOrder;
}

export async function updateShopOrder(input: Input) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const { shopOrder } = validators.input<Input>(input);

    const shopOrdersCollection = db.collection('shopOrders');

    await shopOrdersCollection.updateOne(
        {
            _id: new ObjectId(shopOrder._id)
        },
        {
            $set: {
                number: shopOrder.number,
                priority: shopOrder.priority,
                notes: shopOrder.notes,
                values: shopOrder.values,
                updatedAt: new Date(),
                updatedById: user._id
            }
        });
}