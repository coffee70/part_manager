'use client'
import React from 'react';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';
import StatusIndicator from '../../ui/status_indicator';
import { SelectBase, SelectItem } from '../../ui/select';
import { useQuery } from '@tanstack/react-query';

type Status = {
    _id: string;
    label: string;
    color: string;
}

type Props = {
    value: string[];
    onChange: (ids: string[]) => void;
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

    const handleStatusChange = (_id: string) => {
        // remove status if it's already selected
        if (value.includes(_id)) {
            onChange(value.filter((status) => status !== _id));
            // add status if it's not selected
        } else {
            onChange([...value, _id]);
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
                    key={status._id}
                    onClick={() => handleStatusChange(status._id)}
                >
                    <div className='flex items-center space-x-3'>
                        <StatusIndicator color={status.color} />
                        <span>{status.label}</span>
                    </div>
                    <CheckIcon className={clsx(value.includes(status._id) ? "" : "invisible")} strokeWidth={1.5} size={20} />
                </SelectItem>
            ))}
        </SelectBase>
    )
}