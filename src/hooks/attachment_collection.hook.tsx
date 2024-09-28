'use client'
import { AttachmentCollection } from "@/types/collections";
import { usePathname } from "next/navigation";

const conversion: Record<string, AttachmentCollection> = {
    'customer-orders': 'customerOrders',
    'shop-orders': 'shopOrders',
    'parts': 'parts',
    'serials': 'serials',
}

export function useAttachmentCollection() {
    const attachmentModel = usePathname()?.split('/').pop();

    if (!attachmentModel) {
        throw new Error('Section model not found!');
    }

    return conversion[attachmentModel];
}