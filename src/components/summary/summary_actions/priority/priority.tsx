'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import PriorityItem from './priority_item'
import PriorityButton from './priority_button'
import { priorities, type Priority } from '@/types/collections'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePriority } from '@/server/priority/update_priority'
import { useInstanceURL } from '@/hooks/url_metadata.hook'
import { instanceKeys } from '@/lib/query_keys'

export default function Priority({ priority }: { priority: Priority }) {
    const { modelId, instanceId } = useInstanceURL();

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: updatePriority,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: instanceKeys.id("models", modelId, instanceId) })
            queryClient.invalidateQueries({ queryKey: instanceKeys.all("models", modelId) })
        }
    })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <PriorityButton priority={priority} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {Object.values(priorities).map((p, index) => (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => mutate({ modelId, instanceId, priority: p })}
                        >
                            <PriorityItem priority={p} />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}