'use client'
import React from 'react';
import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon } from "lucide-react";
import { DataAction } from "@/components/ui/data_action";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SelectBase, SelectItem } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { camelCaseToLabel } from '@/lib/language';
import { useInstanceURL } from '@/hooks/url_metadata.hook';
import { useQueryClient } from '@tanstack/react-query';
import { instanceKeys } from '@/lib/query_keys';

type Props = {
    keys: readonly string[];
}

export default function Sort({ keys }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const { modelId } = useInstanceURL();
    const queryClient = useQueryClient();

    const sort_by = searchParams.get('sort_by');
    const sort_order = searchParams.get('sort_order');

    const onChange = (key: string) => {
        const params = new URLSearchParams(searchParams);
        if (sort_by === key) {
            switch (sort_order) {
                case 'asc':
                    params.set('sort_order', 'desc');
                    break;
                case 'desc':
                    params.delete('sort_by');
                    params.delete('sort_order');
                    break;
                default:
                    params.set('sort_order', 'asc');
                    break;
            }
        }
        else {
            params.set('sort_by', key);
            params.set('sort_order', 'asc');
        }
        queryClient.invalidateQueries({ queryKey: instanceKeys.all(modelId) });
        replace(`${pathname}?${params.toString()}`);
    }

    const enabled = sort_by !== null && sort_order !== null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <DataAction enabled={enabled} label='Sort'>
                    <ArrowDownUpIcon size={24} />
                </DataAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56">
                <SelectBase>
                    {keys.map((key) => (
                        <SelectItem key={key} onClick={() => onChange(key)}>
                            <span>{camelCaseToLabel(key)}</span>
                            {sort_by === key && sort_order === 'asc' && <ArrowUpIcon strokeWidth={1.5} size={20} />}
                            {sort_by === key && sort_order === 'desc' && <ArrowDownIcon strokeWidth={1.5} size={20} />}
                        </SelectItem>
                    ))}
                </SelectBase>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}