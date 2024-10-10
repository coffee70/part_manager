'use client'
import { getCustomerOrder } from "@/server/customer_orders/get_customer_order";
import { SectionCollection } from "@/types/collections";
import { usePathname, useSearchParams } from "next/navigation";

const conversion: Record<string, SectionCollection> = {
    'customer-orders': 'customerOrders',
    'shop-orders': 'shopOrders',
    'parts': 'parts',
    'serials': 'serials',
    'customers': 'customers',
}


export function useURLMetadata() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const urlCollection = usePathname()?.split('/').pop();

    if (!urlCollection) {
        throw new Error('URL is malformed! There should be a collection in the URL.');
    }

    const collection = conversion[urlCollection];

    return { id, collection };
}