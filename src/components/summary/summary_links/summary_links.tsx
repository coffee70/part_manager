'use client'
import SummaryBase from "../summary_base"
import SummaryLink from "./summary_link"
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { linkKeys, contextKeys } from "@/lib/query_keys";
import { getLinks } from "@/server/links/get_links";
import AddLink from "./add_link";
import { getContexts } from "@/server/contexts/get_contexts";
import { useMoreContext } from "../summary_actions/more/more_context";

export default function SummaryLinks() {
    const { context, id, instanceId } = useInstanceURL();

    const {
        linkOpen: open,
        setLinkOpen: setOpen
    } = useMoreContext();

    const {
        data: links,
        isPending: linksPending,
        isError: linksError
    } = useQuery({
        queryKey: linkKeys.all(context, id, instanceId),
        queryFn: () => getLinks({ context, id, instanceId }),
    })

    const {
        data: contexts,
        isPending: contextsPending,
        isError: contextsError
    } = useQuery({
        queryKey: contextKeys.all(context),
        queryFn: () => getContexts({ context }),
    })

    if (linksPending || contextsPending) return <div>Loading...</div>

    if (linksError || contextsError) return <div>Error...</div>

    return (
        <>
            <AddLink
                open={open}
                onOpenChange={setOpen}
            />

            <SummaryBase title='Links' action={() => setOpen(true)} label="Add Link">
                <div className='flex flex-col space-y-2'>
                    {contexts.map(context => {
                        const filteredLinks = links.filter(link => link.contextId === context._id)
                        if (filteredLinks.length === 0) return null
                        return (
                            <div key={context._id}>
                                <div className="text-sm font-bold">{context.name}</div>
                                <div className='flex flex-col'>
                                    {links.filter(link => link.contextId === context._id).map(link => (
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