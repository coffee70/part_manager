'use client'

import React from 'react';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';

import StatusIcon from '../svg/status_icon';
import StatusIndicator from '../svg/status_indicator';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';



export default function StatusFilter() {
    const { statuses, handleStatusChange } = useStatuses();
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="icon" className="relative bg-secondary border border-border h-10 w-10">
                    <StatusIcon width={24} height={24} />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <ul className="list-none">
                    {statuses.map((status) => (
                        <li
                            key={status.id}
                            className="flex items-center justify-between px-3 py-2 cursor-default hover:bg-hover focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
                            onClick={() => handleStatusChange(status.id)}
                        >
                            <div className='flex items-center space-x-3'>
                                <StatusIndicator color={status.color} height={12} width={12} />
                                <span>{status.label}</span>
                            </div>
                            <CheckIcon className={clsx(status.selected ? "" : "invisible")} strokeWidth={1.5} size={20} />
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    )
}

function useMultiSelect() {
    const [selected, setSelected] = React.useState([]);
}

function useStatuses() {
    const [statuses, setStatuses] = React.useState([
        { id: 0, label: "Completed", color: "green", selected: false },
        { id: 1, label: "Needs Approval", color: "red", selected: false },
        { id: 2, label: "In Progress", color: "#D6C100", selected: false },
    ])

    const handleStatusChange = (id: number) => {
        setStatuses(
            statuses.map((status) =>
                status.id === id ? { ...status, selected: !status.selected } : status
            )
        )
    }

    return { statuses, handleStatusChange }

}