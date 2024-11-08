'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import PriorityItem from './priority_item'
import PriorityButton from './priority_button'
import { priorities, type Priority } from '@/types/collections'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePriority } from '@/server/priority/update_priority'
import { collectionKeys } from '@/lib/query_keys'
import { useURLMetadata } from '@/hooks/url_metadata.hook'

export default function Priority({ priority }: { priority: Priority }) {

    const { collection, id } = useURLMetadata();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updatePriority,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.id(collection, id) })
            queryClient.invalidateQueries({ queryKey: collectionKeys.all(collection) })
        }
    })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <PriorityButton priority={priority} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {Object.values(priorities).map((info, index) => (
                        <DropdownMenuItem key={index} onClick={() => mutate({ id, collection, priority: priority })}>
                            <PriorityItem priority={info} />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}