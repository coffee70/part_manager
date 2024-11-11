'use client'
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import SummaryLayout from "@/layouts/summary_layout";
import SummaryTitle from "@/components/summary/summary_title/summary_title";
import SummaryToolbar from "@/components/summary/summary_toolbar";
import SummarySections from "@/components/summary/summary_sections/summary_sections";
import SummaryNotes from "@/components/summary/summary_notes/summary_notes";
import SummaryAttachments from "@/components/summary/summary_attachments/summary_attachments";
import SummaryLinks from "@/components/summary/summary_list/summary_links";
import SummaryActivity from "@/components/summary/summary_activity/summary_activity";
import SummarySkeleton from '@/components/summary/summary_skeleton';
import { useURLMetadata } from '@/hooks/url_metadata.hook';
import { collectionKeys } from '@/lib/query_keys';
import SummaryError from '@/components/summary/summary_error';
import CustomerForm from '@/app/(user)/customers/_forms/customer_form';
import Edit from '@/components/summary/summary_actions/edit/edit';
import { getCustomer } from '@/server/customers/get_customer';
import { CustomerIcon } from '@/components/ui/icons/icons';

export default function SummaryContainer() {
    const { id } = useURLMetadata();

    const { data, isError, isPending } = useQuery({
        queryKey: collectionKeys.id('customers', id),
        queryFn: () => getCustomer({ _id: id }),
    })

    if (isPending) return <SummarySkeleton />

    if (isError) return <SummaryError />

    if (!data) return <SummaryError />

    return (
        <SummaryLayout>
            <SummaryTitle
                title={data.name}
                titleKey='number'
            >
                <CustomerIcon size={48} />
            </SummaryTitle>
            <SummaryToolbar>
                <CustomerForm customer={data}>
                    <Edit />
                </CustomerForm>
            </SummaryToolbar>
            <SummarySections values={data.values} />
            <SummaryNotes initialValue={data.notes} />
            <SummaryAttachments files={data.attachments} />
            <SummaryLinks />
            {/* <SummaryPeople people={order.people} />  */}
            <SummaryActivity />
        </SummaryLayout>
    )
}