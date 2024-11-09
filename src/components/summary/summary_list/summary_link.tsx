'use client'
import { More } from "@/components/ui/more";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteLink } from "@/server/links/delete_link";
import { linkKeys } from "@/lib/query_keys";
import { CollectionIcon } from "@/components/ui/icons/icons";
import { getLink } from "@/server/links/get_link";
import React from "react";

type Props = {
    id: string;
    label: string;
    href: string;
}

export default function SummaryLink({ id: linkId, label, href }: Props) {
    const { collection, id } = useURLMetadata();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: deleteLink,
        onSuccess: ({ upsertedId }) => {
            queryClient.invalidateQueries({ queryKey: linkKeys.all(collection, id) })
            queryClient.invalidateQueries({ queryKey: linkKeys.all(collection, upsertedId) })
        }
    })

    const { data: link } = useQuery({
        queryFn: () => getLink({ model: collection, modelId: id, linkId }),
        queryKey: linkKeys.one(collection, linkId, id)
    })

    const handleDelete = () => {
        mutate({
            model: collection,
            modelId: id,
            linkId
        })
    }

    return (
        <div className='flex items-center justify-between flex-1 pl-2 border-b border-foreground'>
            <div className="flex items-center space-x-2">
                {link && <CollectionIcon collection={link.model} size={14} />}
                <Link href={href} className="text-primary cursor-pointer hover:underline hover:underline-offset-2">{label}</Link>
            </div>
            <div className='flex items-center space-x-2'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <More />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}