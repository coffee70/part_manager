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
import EditCustomerOrder from './edit_customer_order';
import SummaryError from '../summary/summary_error';

export default function SummaryContainer() {
    const { id } = useURLMetadata();

    const { data, isError, isPending } = useQuery({
        queryKey: collectionKeys.id('customerOrders', id),
        queryFn: () => getCustomerOrder({ _id: id }),
    })

    if (isPending) return <SummarySkeleton />

    if (isError) return <SummaryError />

    if (!data) return <SummaryError />

    return (
        <SummaryLayout>
            <SummaryTitle title={data.number} items={[{ label: data.customer.name }]} />
            <SummaryToolbar>
                <EditCustomerOrder customerOrder={data}/>
                <Priority />
                {/* <Status /> */}
            </SummaryToolbar>
            <SummarySections values={data.values} />
            <SummaryNotes initialValue={data.notes} />
            <SummaryAttachments files={data.attachments} />
            {/* <SummaryList items={data.parts} /> */}
            {/* <SummaryPeople people={order.people} />  */}
            <SummaryActivity />
        </SummaryLayout>
    )
}