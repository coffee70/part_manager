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

    const priorityInfo = priorities.find(priorityInfo => priorityInfo.label === priority)

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updatePriority,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionKeys.id(collection, id) })
            queryClient.invalidateQueries({ queryKey: collectionKeys.all(collection) })
        }
    })

    if (!priorityInfo) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <PriorityButton priorityInfo={priorityInfo} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {priorities.map((priorityInfo, index) => (
                        <DropdownMenuItem key={index} onClick={() => mutate({ id, collection, priority: priorityInfo.label })}>
                            <PriorityItem priorityInfo={priorityInfo} />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}