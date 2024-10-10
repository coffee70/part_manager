'use client'
import { useQuery } from "@tanstack/react-query";
import { getSections } from "@/server/sections/get_sections";
import { sectionKeys } from "@/lib/query_keys";
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