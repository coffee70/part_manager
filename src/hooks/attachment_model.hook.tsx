'use client'
import { AttachmentModel } from "@prisma/client";
import { usePathname } from "next/navigation";

const conversion: Record<string, AttachmentModel> = {
    'customer-orders': 'CUSTOMER_ORDER',
    'shop-orders': 'SHOP_ORDER',
    'parts': 'PART',
    'serials': 'SERIAL',
}

export function useAttachmentModel() {
    const attachmentModel = usePathname()?.split('/').pop();

    if (!attachmentModel) {
        throw new Error('Section model not found!');
    }

    return conversion[attachmentModel];
}