'use client'
import ShopOrderForm from "@/app/(user)/shop-orders/_forms/shop_order_form";
import { DataAction } from "@/components/ui/data_action";
import { PlusIcon } from "lucide-react";
import React from "react";

export default function NewShopOrder() {

    return (
        <ShopOrderForm>
            <DataAction label='New'>
                <PlusIcon width={24} height={24} />
            </DataAction>
        </ShopOrderForm>
    )
}