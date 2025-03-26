'use client'
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { SummaryHeader, SummaryContent } from "@/layouts/summary_layout";
import SummaryToolbar from "@/components/summary/summary_toolbar";
import Priority from "@/components/summary/summary_actions/priority/priority";
import SummarySections from "@/components/summary/summary_sections/summary_sections";
import SummaryNotes from "@/components/summary/summary_notes/summary_notes";
import SummaryAttachments from "@/components/summary/summary_attachments/summary_attachments";
import SummaryLinks from "@/components/summary/summary_links/summary_links";
import SummaryActivity from "@/components/summary/summary_activity/summary_activity";
import SummarySkeleton from '@/components/summary/summary_skeleton';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { instanceKeys, contextKeys } from '@/lib/query_keys';
import SummaryError from '@/components/summary/summary_error';
import Edit from '@/components/summary/summary_actions/edit/edit';
import { getInstance } from '@/server/instances/get_instance';
import InstanceForm from './instance_form';
import SummaryNumber from '@/components/summary/summary_title/summary_number';
import { isAttachable } from '@/server/contexts/is_attachable';
import { isLinkable } from '@/server/contexts/is_linkable';
import { isCommentable } from '@/server/contexts/is_commentable';
import { hasPriority } from '@/server/contexts/has_priority';
import More from '../summary/summary_actions/more/more';
import { MoreProvider } from '../summary/summary_actions/more/more_context';
import Step from '@/components/summary/summary_actions/step/step';

export default function SummaryContainer() {
    const { context, id, instanceId } = useInstanceURL();

    const { data: instance, isError, isPending } = useQuery({
        queryKey: instanceKeys.id(context, id, instanceId),
        queryFn: () => getInstance({ id, instanceId }),
    })

    const { data: attachable } = useQuery({
        queryKey: contextKeys.attachable(context, id),
        queryFn: () => isAttachable({ context, id }),
    })

    const { data: linkable } = useQuery({
        queryKey: contextKeys.linkable(context, id),
        queryFn: () => isLinkable({ context, id }),
    })

    const { data: commentable } = useQuery({
        queryKey: contextKeys.commentable(context, id),
        queryFn: () => isCommentable({ context, id }),
    })

    const { data: priority } = useQuery({
        queryKey: contextKeys.hasPriority(context, id),
        queryFn: () => hasPriority({ context, id }),
    })

    if (isPending) return <SummarySkeleton />

    if (isError) return <SummaryError />

    if (!instance) return <SummaryError />

    return (
        <MoreProvider>
            <SummaryHeader>
                <SummaryNumber number={instance.number} />
                <SummaryToolbar>
                    <InstanceForm instance={instance}>
                        <Edit />
                    </InstanceForm>
                    <More />
                    {priority && <Priority priority={instance.priority} />}
                    <Step />
                </SummaryToolbar>
            </SummaryHeader>

            <SummaryContent>
                <SummarySections values={instance.values} />
                <SummaryNotes initialValue={instance.notes} />
                {attachable && <SummaryAttachments />}
                {linkable && <SummaryLinks />}
                {commentable && <SummaryActivity />}
            </SummaryContent>
        </MoreProvider>
    )
}