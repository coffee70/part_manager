'use client'
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { getCustomerOrder } from "@/server/customer_orders/get_customer_order";
import { getParts } from "@/server/customer_orders/get_parts";
import { useSearchParams } from "next/navigation";
import { convertSearchParams } from "@/lib/search_params";
import SummaryLayout from "@/layouts/summary_layout";
import SummaryTitle from "@/components/summary/summary_title";
import SummaryToolbar from "@/components/summary/summary_toolbar";
import Priority from "@/components/summary/summary_actions/priority/priority";
import Status from "@/components/summary/summary_actions/status/status";
import SummaryDetails from "@/components/summary/summary_details/summary_details";
import SummaryNotes from "@/components/summary/summary_notes/summary_notes";
import SummaryAttachments from "@/components/summary/summary_attachments/summary_attachments";
import SummaryList, { Item } from "@/components/summary/summary_list/summary_list";
import SummaryActivity from "@/components/summary/summary_activity/summary_activity";
import SummarySkeleton from '@/components/summary/summary_skeleton';
import { useSectionModel } from '@/hooks/section_model.hook';

export default function SummaryContainer() {
    const readOnlySearchParams = useSearchParams()
    const searchParams = convertSearchParams(readOnlySearchParams)

    const sectionModel = useSectionModel()

    const { data, isError, isPending } = useQuery({
        queryKey: ['customerOrder', searchParams],
        queryFn: () => getCustomerOrder({ searchParams }),
    })

    if (isPending) return <SummarySkeleton />

    if (isError) return <div>Error...</div>

    if (data === null) return <div>Not found</div>
    
    let order = { 
        details: [
            { id: 1, label: 'Label 1', value: 'Super large value here to overflow!!!!!!!!' },
            { id: 2, label: 'Label 2', value: 'Value 2' },
            { id: 3, label: 'Label 3', value: 'Value 3' },
        ]
    }

    return (
        <SummaryLayout>
            <SummaryTitle title={data.number} items={[{ label: data.customer.name }]} />
            <SummaryToolbar>
                <Priority />
                <Status />
            </SummaryToolbar>
            <SummaryDetails details={order.details} />
            <SummaryNotes placeholder="Here are some notes on the order." />
            <SummaryAttachments files={data.attachments} uploads={{ id: data.id, type: sectionModel }}/>
            {/* <SummaryListContainer items={data.parts} /> */}
            {/* <SummaryPeople people={order.people} />  */}
            <SummaryActivity />
        </SummaryLayout>
    )
}


function SummaryListContainer({ items }: { items: Item[]}) {
    const { data, isError, isPending } = useQuery({
        queryKey: ['parts'],
        queryFn: getParts,
    })

    if (isPending) return <div>Loading...</div>

    if (isError) return <div>Error...</div>

    if (data === null) return <div>Not found</div>

    return (
        <SummaryList
            title="Parts"
            label="Add Part"
            placeholder="Part Number"
            items={items}
            options={data}
        />
    )
}