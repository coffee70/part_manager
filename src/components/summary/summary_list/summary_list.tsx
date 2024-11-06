'use client'
import SummaryBase from "../summary_base"
import SummaryListItem from "./summary_list_item"
import React from "react";
import { ComboboxOption } from "./add_item/combobox";
import { EditProvider } from "./add_item/edit_context";
import AddItem, { Props as AddItemProps } from "./add_item/add_item";
import { useQuery } from "@tanstack/react-query";
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { linkKeys } from "@/lib/query_keys";
import { getLinks } from "@/server/links/get_links";

export default function SummaryList() {
    const { id, collection } = useURLMetadata();

    const { data: links, isPending, isError } = useQuery({
        queryKey: linkKeys.all(collection, id),
        queryFn: () => getLinks({ modelId: id, model: collection }),
    })

    if (isPending) return <div>Loading...</div>

    if (isError) return <div>Error...</div>

    return (
        <SummaryBase title='Links'>
            <div className='flex flex-col last:border-b last:border-foreground last:border-dashed'>
                {links.map(link => <SummaryListItem key={link._id} label={link.name} href={link.href} />)}
                {/* <EditProvider>
                    {options ? (
                        <AddItem label={label} value={value} onChange={onChange} options={options} placeholder={placeholder} />
                    ) : (
                        <AddItem label={label} value={value} onChange={onChange} options={options} placeholder={placeholder} />
                    )}
                </EditProvider> */}
            </div>
        </SummaryBase>
    )
}