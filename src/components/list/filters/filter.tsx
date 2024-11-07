'use client'
import React from "react";
import { FilterIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { DataAction } from "../../ui/data_action";
import { useSearchParams } from "next/navigation";
import { labelToCamelCase } from "@/lib/language";

type Props = {
    children: React.ReactNode;
    labels: string[];
}


export default function Filter({ children, labels }: Props) {

    const searchParams = useSearchParams();

    const enabled = labels.some(label => searchParams.has(labelToCamelCase(label)))

    if (React.Children.count(children) !== labels.length) throw new Error('Filter children and labels must be the same length')

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <DataAction enabled={enabled} label='Filters'>
                    <FilterIcon width={24} height={24} />
                </DataAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56">
                <DropdownMenuGroup>
                    {React.Children.map(children, (child, index) => (
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>{labels[index]}</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {child}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}