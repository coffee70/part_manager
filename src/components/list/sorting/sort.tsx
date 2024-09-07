'use client'
import React from 'react';
import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon } from "lucide-react";
import { DataAction } from "@/components/ui/data_action";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sortable } from "@/hooks/sort.hook";
import { SelectBase, SelectItem } from "@/components/ui/select";

type Props<T> = {
    sort: T;
    setSort: (key: keyof T) => void;
}

export default function Sort<T extends Sortable>({ sort, setSort }: Props<T>) {

    const enabled = Object.keys(sort).some(key => sort[key].type !== undefined);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <DataAction enabled={enabled}>
                    <ArrowDownUpIcon size={24} />
                </DataAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56">
                <SelectBase>
                    {Object.keys(sort).map((key) => (
                        <SelectItem key={key} onClick={() => setSort(key)}>
                            <span>{sort[key].label}</span>
                            {sort[key].type === 'asc' && <ArrowUpIcon strokeWidth={1.5} size={20} />}
                            {sort[key].type === 'desc' && <ArrowDownIcon strokeWidth={1.5} size={20} />}
                        </SelectItem>
                    ))}
                </SelectBase>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}