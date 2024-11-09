'use client'
import { More } from "@/components/ui/more";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLink } from "@/server/links/delete_link";
import { linkKeys } from "@/lib/query_keys";

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

    const handleDelete = () => {
        mutate({ 
            model: collection,
            modelId: id,
            linkId
        })
    }

    return (
        <div className='flex items-center justify-between flex-1 py-1 border-b border-foreground'>
            <Link href={href} className="text-primary cursor-pointer hover:underline hover:underline-offset-2">{label}</Link>
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