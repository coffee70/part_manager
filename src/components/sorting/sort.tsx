'use client'
import React from 'react';
import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon } from "lucide-react";
import { DataAction } from "../data_actions/data_action_button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Sortable } from "../../hooks/sort.hook";
import { SelectBase, SelectItem } from "../ui/select";

type Props<T> = {
    sort: T;
    setSort: (key: keyof T) => void;
}

export default function Sort<T extends Sortable>({ sort, setSort }: Props<T>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <DataAction>
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