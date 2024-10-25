'use client'
import React from "react";
import { FilterIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { DataAction } from "../../ui/data_action";
// import StatusFilter from "./filter_status";
import DateRangeFilter from "./filter_date_range";
import PriorityFilter from "./filter_priority";
import { useSearchParams } from "next/navigation";


export default function Filter() {

    const searchParams = useSearchParams();

    const enabled = {
        updatedAt: searchParams.has('updatedAt'),
        priority: searchParams.has('priority')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <DataAction enabled={enabled.priority || enabled.updatedAt} label='Filters'>
                    <FilterIcon width={24} height={24} />
                </DataAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56">
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Date Range</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DateRangeFilter paramKey='updatedAt' />
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <PriorityFilter />
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    {/* <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <StatusFilter />
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub> */}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}