'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import PriorityItem from './priority_item'
import { type Priority } from '@/types/types'
import PriorityButton from './priority_button'

const priorities: Priority[] = []

export default function Priority() {
    const [priority, setPriority] = React.useState<Priority>(priorities[0])
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <PriorityButton priority={priority} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {priorities.map((priority, index) => (
                        <DropdownMenuItem key={index} onClick={() => setPriority(priority)}>
                            <PriorityItem priority={priority} />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}