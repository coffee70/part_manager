'use client'
import SummaryBase from "../summary_base"
import SummaryLink from "./summary_link"
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { linkKeys, modelKeys } from "@/lib/query_keys";
import { getLinks } from "@/server/links/get_links";
import AddLink from "./add_link";
import { getModels } from "@/server/models/get_models";

export default function SummaryLinks() {
    const { modelId, instanceId } = useInstanceURL();

    const [open, setOpen] = React.useState(false);

    const {
        data: links,
        isPending: linksPending,
        isError: linksError
    } = useQuery({
        queryKey: linkKeys.all(modelId, instanceId),
        queryFn: () => getLinks({ modelId, instanceId }),
    })

    const {
        data: models,
        isPending: modelsPending,
        isError: modelsError
    } = useQuery({
        queryKey: modelKeys.all(),
        queryFn: () => getModels(),
    })

    if (linksPending || modelsPending) return <div>Loading...</div>

    if (linksError || modelsError) return <div>Error...</div>

    return (
        <>
            <AddLink
                open={open}
                onOpenChange={setOpen}
            />

            <SummaryBase title='Links' action={() => setOpen(true)} label="Add Link">
                <div className='flex flex-col space-y-2'>
                    {models.map(model => {
                        const filteredLinks = links.filter(link => link.modelId === model._id)
                        if (filteredLinks.length === 0) return null
                        return (
                            <div key={model._id}>
                                <div className="text-sm font-bold">{model.name}</div>
                                <div className='flex flex-col'>
                                    {links.filter(link => link.modelId === model._id).map(link => (
                                        <SummaryLink key={link._id} link={link} />
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