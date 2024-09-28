'use client'
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { getCustomerOrder } from "@/server/customer_orders/get_customer_order";
import SummaryLayout from "@/layouts/summary_layout";
import SummaryTitle from "@/components/summary/summary_title";
import SummaryToolbar from "@/components/summary/summary_toolbar";
import Priority from "@/components/summary/summary_actions/priority/priority";
import Status from "@/components/summary/summary_actions/status/status";
import SummarySections from "@/components/summary/summary_sections/summary_sections";
import SummaryNotes from "@/components/summary/summary_notes/summary_notes";
import SummaryAttachments from "@/components/summary/summary_attachments/summary_attachments";
import SummaryList, { Item } from "@/components/summary/summary_list/summary_list";
import SummaryActivity from "@/components/summary/summary_activity/summary_activity";
import SummarySkeleton from '@/components/summary/summary_skeleton';
import { useURLMetadata } from '@/hooks/url_metadata.hook';
import { collectionKeys } from '@/lib/query_keys';

export default function SummaryContainer() {
    const { id } = useURLMetadata();

    const { data, isError, isPending } = useQuery({
        queryKey: collectionKeys.id('customerOrders', id),
        queryFn: () => getCustomerOrder({ _id: id }),
    })

    if (isPending) return <SummarySkeleton />

    if (isError) return <div>Error...</div>

    if (!data) return <div>Not found</div>

    return (
        <SummaryLayout>
            <SummaryTitle title={data.number} items={[{ label: data.customer.name }]} />
            <SummaryToolbar>
                <Priority />
                <Status />
            </SummaryToolbar>
            <SummarySections sections={data.sections} />
            {/* <SummaryNotes placeholder="Here are some notes on the order." /> */}
            <SummaryAttachments files={data.attachments} uploads={{ _id: data._id }} />
            {/* <SummaryList items={data.parts} /> */}
            {/* <SummaryPeople people={order.people} />  */}
            <SummaryActivity />
        </SummaryLayout>
    )
}