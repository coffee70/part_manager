'use client'
import React from 'react';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';
import StatusIcon from '../svg/status_icon';
import StatusIndicator from '../svg/status_indicator';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { fetchOrderStatuses } from '@/api/statusData';
import { FilterButton } from './filter_button';
import { useFilterContext } from './filter_context';

export default function StatusFilter() {
    const { statusIds, setStatusIds } = useFilterContext();
    const statuses = fetchOrderStatuses();
    const handleStatusChange = (id: number) => {
        // remove status if it's already selected
        if (statusIds.includes(id)) {
            setStatusIds(prev => prev.filter((status) => status !== id));
            // add status if it's not selected
        } else {
            setStatusIds(prev => [...prev, id]);
        }
    }
    return (
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
                    <CheckIcon className={clsx(statusIds.includes(status.id) ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </li>
            ))}
        </ul>
    )
}