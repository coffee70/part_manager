'use client'
import React from 'react';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';
import StatusIndicator from '../svg/status_indicator';
import { useFilterContext } from '../../context/filters/filter.context';
import { fetchStatusData } from '@/api/data';
import { SelectBase, SelectItem } from '../ui/select';

export default function StatusFilter() {
    const { statusIds, setStatusIds } = useFilterContext();
    const statuses = fetchStatusData();
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
        <SelectBase>
            {statuses.map((status) => (
                <SelectItem
                    key={status.id}
                    onClick={() => handleStatusChange(status.id)}
                >
                    <div className='flex items-center space-x-3'>
                        <StatusIndicator color={status.color} height={12} width={12} />
                        <span>{status.label}</span>
                    </div>
                    <CheckIcon className={clsx(statusIds.includes(status.id) ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            ))}
        </SelectBase>
    )
}