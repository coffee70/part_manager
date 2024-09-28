'use server'
import client from "@/lib/mongo/db"
import { ObjectId } from "mongodb"
import { Section } from "@/types/collections"
import { CustomerOrder } from "@/types/collections"
import { getFields } from "@/server/fields/get_fields"

export async function getFieldValues({ customerOrderId }: { customerOrderId: string }) {

    const _id = new ObjectId(customerOrderId)

    // get all sections
    const db = client.db('test')
    const sections = db.collection<Section>('sections')
    const allSections = await sections.find().toArray()

    // loop over sections, placing value in field if customerOrderId has a value
    const customerOrders = db.collection<CustomerOrder>('customerOrders')
    const customerOrder = await customerOrders.findOne({ _id: _id })

     const fields = await Promise.all(allSections.map(async section => {
        const fields = await getFields({ sectionId: section._id.toString() });
        const mergedFields = fields.map(field => {
            const value = customerOrder?.fields.find(f => f._id === field._id)?.value;
            return {
                ...field,
                value
            };
        });
        return {
            ...section,
            fields: mergedFields
        };
    }));

    return fields
}