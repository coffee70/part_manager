'use client'
import Link from "next/link";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLink } from "@/server/links/delete_link";
import { instanceKeys, linkKeys } from "@/lib/query_keys";
import React from "react";
import { router } from "@/lib/url";
import { XIcon } from "lucide-react";

type Props = {
    link: {
        _id: string;
        contextId: string;
        instanceId: string;
        number: string;
        color: string;
    }
}

export default function SummaryLink({ link }: Props) {
    const { context, id, instanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => deleteLink({ id, instanceId, linkId: link._id }),
        onSuccess: ({ linkContextId, linkInstanceId }) => {
            queryClient.invalidateQueries({ queryKey: linkKeys.all(context, id, instanceId) })
            queryClient.invalidateQueries({ queryKey: linkKeys.all(context, linkContextId, linkInstanceId) })
            queryClient.invalidateQueries({ queryKey: instanceKeys.all(context, id) })
        }
    })

    return (
        <div id={`link-${link.number}`} className='group flex items-center justify-between flex-1 pl-2 border-b border-foreground'>
            <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center h-8">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: link.color }}
                    />
                </div>
                <Link
                    href={router().context(context).instances().instance(link.contextId, link.instanceId)}
                    className="text-primary cursor-pointer hover:underline hover:underline-offset-2"
                >{link.number}</Link>
            </div>
            <div className='flex items-center space-x-2'>
                <button
                    id={`delete-link-${link.number}`}
                    type="button"
                    className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-sm hover:bg-foreground"
                    onClick={() => mutate()}
                >
                    <XIcon size={20} />
                </button>
            </div>
        </div>
    )
}