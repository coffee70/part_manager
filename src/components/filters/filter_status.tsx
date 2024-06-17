'use client'
import React from 'react';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';
import StatusIndicator from '../svg/status_indicator';
import { SelectBase, SelectItem } from '../ui/select';
import { useQuery } from '@tanstack/react-query';
import { Status } from '@prisma/client';

type Props = {
    value: number[];
    onChange: (ids: number[]) => void;
}

const useStatusFilter = ({ value, onChange }: Props) => {
    const { data: statuses, isLoading, isError } = useQuery({
        queryKey: ['statuses'],
        queryFn: async () => {
            const data = await fetch('/api/statuses');
            const statuses: Status[] = await data.json();
            return statuses;
        }
    });

    const handleStatusChange = (id: number) => {
        // remove status if it's already selected
        if (value.includes(id)) {
            onChange(value.filter((status) => status !== id));
            // add status if it's not selected
        } else {
            onChange([...value, id]);
        }
    }

    return { statuses, isLoading, isError, handleStatusChange };
}

export default function StatusFilter({ value, onChange }: Props) {

    const { statuses, handleStatusChange } = useStatusFilter({ value, onChange });

    return (
        <SelectBase>
            {statuses?.map((status) => (
                <SelectItem
                    key={status.id}
                    onClick={() => handleStatusChange(status.id)}
                >
                    <div className='flex items-center space-x-3'>
                        <StatusIndicator color={status.color} />
                        <span>{status.label}</span>
                    </div>
                    <CheckIcon className={clsx(value.includes(status.id) ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            ))}
        </SelectBase>
    )
}