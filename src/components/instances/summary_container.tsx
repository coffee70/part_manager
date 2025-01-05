'use client'
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import SummaryLayout from "@/layouts/summary_layout";
import SummaryToolbar from "@/components/summary/summary_toolbar";
import Priority from "@/components/summary/summary_actions/priority/priority";
import SummarySections from "@/components/summary/summary_sections/summary_sections";
import SummaryNotes from "@/components/summary/summary_notes/summary_notes";
import SummaryAttachments from "@/components/summary/summary_attachments/summary_attachments";
import SummaryLinks from "@/components/summary/summary_list/summary_links";
import SummaryActivity from "@/components/summary/summary_activity/summary_activity";
import SummarySkeleton from '@/components/summary/summary_skeleton';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { instanceKeys } from '@/lib/query_keys';
import SummaryError from '@/components/summary/summary_error';
import Edit from '@/components/summary/summary_actions/edit/edit';
import { getInstance } from '@/server/instances/get_instance';
import InstanceForm from './instance_form';
import SummaryNumber from '@/components/summary/summary_title/summary_number';

export default function SummaryContainer() {
    const { modelId, instanceId } = useInstanceURL();

    const { data: instance, isError, isPending } = useQuery({
        queryKey: instanceKeys.id(modelId, instanceId),
        queryFn: () => getInstance({ modelId, instanceId }),
    })

    if (isPending) return <SummarySkeleton />

    if (isError) return <SummaryError />

    if (!instance) return <SummaryError />

    return (
        <SummaryLayout>
            <SummaryNumber number={instance.number} />
            <SummaryToolbar>
                <InstanceForm instance={instance}>
                    <Edit />
                </InstanceForm>
                <Priority priority={instance.priority} />
                {/* <Status /> */}
            </SummaryToolbar>
            <SummarySections values={instance.values} />
            <SummaryNotes initialValue={instance.notes} />
            <SummaryAttachments files={instance.attachments} />
            <SummaryLinks />
            {/* <SummaryPeople people={order.people} />  */}
            <SummaryActivity />
        </SummaryLayout>
    )
}