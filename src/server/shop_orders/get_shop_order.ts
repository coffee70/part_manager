'use server'
import { db } from "@/lib/db";
import { Priority, ShopOrderDoc } from "@/types/collections";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentSession } from "../auth/get_current_session";
import { getAttachment } from "../attachments/get_attachment";

const OutputSchema = z.object({
    _id: z.string(),
    number: z.string(),
    priority: z.custom<Priority>(),
    notes: z.string(),
    attachments: z.array(z.object({
        _id: z.string(),
        name: z.string(),
        base64: z.string(),
        type: z.string()
    })),
    values: z.record(z.union([z.string(), z.array(z.string())]))
}).nullable();

export async function getShopOrder({ _id }: { _id?: string | null }) {
    const { user } = await getCurrentSession();
    if (!user) throw new Error('Unauthorized');

    const shopOrdersCollection = db.collection<ShopOrderDoc>('shopOrders');

    // if no id is provided, redirect to the first customer order so the URL is formed correctly
    // since alot of frontend functionality relies on the id being present in the URL
    if (!_id) {
        const shopOrder = await shopOrdersCollection.findOne();
        if (!shopOrder) {
            return null;
        }

        _id = shopOrder._id.toString();

        redirect(`/shop-orders/?id=${_id}`);
    }

    const shopOrder = await shopOrdersCollection.findOne({ _id: new ObjectId(_id) })

    if (!shopOrder) {
        throw new Error(`Shop Order with id ${_id} not found`);
    }

    const attachments = await Promise.all(
        shopOrder.attachments?.map(async (attachment) => {
            const blob = await getAttachment({ _id: attachment._id.toString() });
            const arrayBuffer = await blob.arrayBuffer();
            const base64String = Buffer.from(arrayBuffer).toString('base64');

            return {
                _id: attachment._id.toString(),
                name: attachment.filename,
                base64: base64String,
                type: blob.type
            };
        }) || []
    );

    const res = {
        ...shopOrder,
        _id: shopOrder._id.toString(),
        attachments
    }

    return OutputSchema.parse(res);
}