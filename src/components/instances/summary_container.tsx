'use client'
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import SummaryLayout from "@/layouts/summary_layout";
import SummaryToolbar from "@/components/summary/summary_toolbar";
import Priority from "@/components/summary/summary_actions/priority/priority";
import SummarySections from "@/components/summary/summary_sections/summary_sections";
import SummaryNotes from "@/components/summary/summary_notes/summary_notes";
import SummaryAttachments from "@/components/summary/summary_attachments/summary_attachments";
import SummaryLinks from "@/components/summary/summary_links/summary_links";
import SummaryActivity from "@/components/summary/summary_activity/summary_activity";
import SummarySkeleton from '@/components/summary/summary_skeleton';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { instanceKeys, modelKeys } from '@/lib/query_keys';
import SummaryError from '@/components/summary/summary_error';
import Edit from '@/components/summary/summary_actions/edit/edit';
import { getInstance } from '@/server/instances/get_instance';
import InstanceForm from './instance_form';
import SummaryNumber from '@/components/summary/summary_title/summary_number';
import { isAttachable } from '@/server/models/is_attachable';
import { isLinkable } from '@/server/models/is_linkable';
import { isCommentable } from '@/server/models/is_commentable';
import { hasPriority } from '@/server/models/has_priority';
import More from '../summary/summary_actions/more/more';
import { MoreProvider } from '../summary/summary_actions/more/more_context';

export default function SummaryContainer() {
    const { modelId, instanceId } = useInstanceURL();

    const { data: instance, isError, isPending } = useQuery({
        queryKey: instanceKeys.id(modelId, instanceId),
        queryFn: () => getInstance({ modelId, instanceId }),
    })

    const { data: attachable } = useQuery({
        queryKey: modelKeys.attachable(modelId),
        queryFn: () => isAttachable({ modelId }),
    })

    const { data: linkable } = useQuery({
        queryKey: modelKeys.linkable(modelId),
        queryFn: () => isLinkable({ modelId }),
    })

    const { data: commentable } = useQuery({
        queryKey: modelKeys.commentable(modelId),
        queryFn: () => isCommentable({ modelId }),
    })

    const { data: priority } = useQuery({
        queryKey: modelKeys.hasPriority(modelId),
        queryFn: () => hasPriority({ modelId }),
    })

    if (isPending) return <SummarySkeleton />

    if (isError) return <SummaryError />

    if (!instance) return <SummaryError />

    return (
        <MoreProvider>
            <SummaryLayout>
                <SummaryNumber number={instance.number} />
                <SummaryToolbar>
                    <InstanceForm instance={instance}>
                        <Edit />
                    </InstanceForm>
                    <More />
                    {priority && <Priority priority={instance.priority} />}
                </SummaryToolbar>
                <SummarySections values={instance.values} />
                <SummaryNotes initialValue={instance.notes} />
                {attachable && <SummaryAttachments />}
                {linkable && <SummaryLinks />}
                {commentable && <SummaryActivity />}
            </SummaryLayout>
        </MoreProvider>
    )
}