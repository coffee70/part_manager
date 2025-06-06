'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { type Status } from '@/types/types'
import StatusButton from './status_button'
import StatusItem from './status_item'

const statuses: Status[] = [
    {
        id: 1,
        label: 'Open',
        color: 'blue',
        completed: false,
    }
]

export default function Status() {
    const [status, setStatus] = React.useState<Status>(statuses[0])
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <StatusButton status={status} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {statuses.map((status, index) => (
                        <DropdownMenuItem key={index} onClick={() => setStatus(status)}>
                            <StatusItem status={status} />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}