'use client'
import CustomerOrderForm from "@/components/customer-orders/customer_order_form";
import { DataAction } from "@/components/ui/data_action";
import { PlusIcon } from "lucide-react";
import React from "react";

export default function NewCustomerOrder() {

    return (
        <CustomerOrderForm>
            <DataAction label='New'>
                <PlusIcon width={24} height={24} />
            </DataAction>
        </CustomerOrderForm>
    )
}