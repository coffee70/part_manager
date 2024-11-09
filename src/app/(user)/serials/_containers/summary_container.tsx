'use client'
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import SummaryLayout from "@/layouts/summary_layout";
import SummaryTitle from "@/components/summary/summary_title/summary_title";
import SummaryToolbar from "@/components/summary/summary_toolbar";
import Status from "@/components/summary/summary_actions/status/status";
import SummarySections from "@/components/summary/summary_sections/summary_sections";
import SummaryNotes from "@/components/summary/summary_notes/summary_notes";
import SummaryAttachments from "@/components/summary/summary_attachments/summary_attachments";
import SummaryList, { Item } from "@/components/summary/summary_list/summary_list";
import SummaryActivity from "@/components/summary/summary_activity/summary_activity";
import SummarySkeleton from '@/components/summary/summary_skeleton';
import { useURLMetadata } from '@/hooks/url_metadata.hook';
import { collectionKeys } from '@/lib/query_keys';
import SummaryError from '@/components/summary/summary_error';
import { getSerial } from '@/server/serials/get_serial';
import SerialForm from '@/app/(user)/serials/_forms/serial_form';
import Edit from '@/components/summary/summary_actions/edit/edit';

export default function SummaryContainer() {
    const { id } = useURLMetadata();

    const { data, isError, isPending } = useQuery({
        queryKey: collectionKeys.id('serials', id),
        queryFn: () => getSerial({ _id: id }),
    })

    if (isPending) return <SummarySkeleton />

    if (isError) return <SummaryError />

    if (!data) return <SummaryError />

    return (
        <SummaryLayout>
            <SummaryTitle
                title={data.number}
                titleKey='number'
            />
            <SummaryToolbar>
                <SerialForm serial={data}>
                    <Edit />
                </SerialForm>
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