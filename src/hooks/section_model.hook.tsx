'use client'
import { SectionModel } from "@prisma/client";
import { usePathname } from "next/navigation";

const conversion: Record<string, SectionModel> = {
    'customer-orders': 'CUSTOMER_ORDER',
    'shop-orders': 'SHOP_ORDER',
    'parts': 'PART',
    'serials': 'SERIAL',
}

export function useSectionModel() {
    const sectionModel = usePathname()?.split('/').pop();

    if (!sectionModel) {
        throw new Error('Section model not found!');
    }

    return conversion[sectionModel];
}