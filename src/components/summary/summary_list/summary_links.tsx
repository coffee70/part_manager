'use client'
import SummaryBase from "../summary_base"
import SummaryLink from "./summary_link"
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { linkKeys } from "@/lib/query_keys";
import { getLinks } from "@/server/links/get_links";
import { sectionCollections } from "@/types/collections";
import { collectionToName } from "@/lib/conversions";
import AddLink from "./add_link";

export default function SummaryLinks() {
    const { id, collection } = useURLMetadata();

    const [open, setOpen] = React.useState(false);

    const { data: links, isPending, isError } = useQuery({
        queryKey: linkKeys.all(collection, id),
        queryFn: () => getLinks({ modelId: id, model: collection }),
    })

    if (isPending) return <div>Loading...</div>

    if (isError) return <div>Error...</div>

    return (
        <>
            <AddLink
                open={open}
                onOpenChange={setOpen}
            />

            <SummaryBase title='Links' action={() => setOpen(true)} label="Add Link">
                <div className='flex flex-col space-y-2'>
                    {sectionCollections.map(collection => {
                        const filteredLinks = links?.filter(link => link.model === collection)
                        if (filteredLinks.length === 0) return null
                        return (
                            <div key={collection}>
                                <div>{collectionToName[collection]}</div>
                                <div className='flex flex-col'>
                                    {links?.filter(link => link.model === collection).map(link => (
                                        <SummaryLink
                                            key={link._id}
                                            id={link._id}
                                            label={link.name}
                                            href={link.href}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </SummaryBase>
        </>
    )
}