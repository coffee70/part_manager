'use client'
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import SummaryLayout from "@/layouts/summary_layout";
import SummaryTitle from "@/components/summary/summary_title/summary_title";
import SummaryToolbar from "@/components/summary/summary_toolbar";
import Priority from "@/components/summary/summary_actions/priority/priority";
import Status from "@/components/summary/summary_actions/status/status";
import SummarySections from "@/components/summary/summary_sections/summary_sections";
import SummaryNotes from "@/components/summary/summary_notes/summary_notes";
import SummaryAttachments from "@/components/summary/summary_attachments/summary_attachments";
import SummaryLinks from "@/components/summary/summary_list/summary_links";
import SummaryActivity from "@/components/summary/summary_activity/summary_activity";
import SummarySkeleton from '@/components/summary/summary_skeleton';
import { useURLMetadata } from '@/hooks/url_metadata.hook';
import { collectionKeys } from '@/lib/query_keys';
import SummaryError from '@/components/summary/summary_error';
import { getShopOrder } from '@/server/shop_orders/get_shop_order';
import ShopOrderForm from '@/app/(user)/shop-orders/_forms/shop_order_form';
import Edit from '@/components/summary/summary_actions/edit/edit';
import { ShopOrderIcon } from '@/components/ui/icons/icons';

export default function SummaryContainer() {
    const { id } = useURLMetadata();

    const { data, isError, isPending } = useQuery({
        queryKey: collectionKeys.id('shopOrders', id),
        queryFn: () => getShopOrder({ _id: id }),
    })

    if (isPending) return <SummarySkeleton />

    if (isError) return <SummaryError />

    if (!data) return <SummaryError />

    return (
        <SummaryLayout>
            <SummaryTitle
                title={data.number}
                titleKey='number'
            >
                <ShopOrderIcon size={48} />
            </SummaryTitle>
            <SummaryToolbar>
                <ShopOrderForm shopOrder={data}>
                    <Edit />
                </ShopOrderForm>
                <Priority priority={data.priority} />
                {/* <Status /> */}
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