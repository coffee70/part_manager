import React from "react";
import { FilterIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DataAction } from "../data_actions/data_action_button";
import { DateRange } from "react-day-picker";
import StatusFilter from "./filter_status";
import DateFilter from "./filter_date";

type Filters = {
    updatedAt: DateRange;
    statusId: number[];
}

type Props<T extends Filters> = {
    filters: T;
    setFilters: (key: keyof T, value: any) => void;
}

export default function Filter<T extends Filters>({ filters, setFilters }: Props<T>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <DataAction>
                    <FilterIcon width={24} height={24} />
                </DataAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56">
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Date Range</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DateFilter value={filters.updatedAt} onChange={(value) => setFilters('updatedAt', value)}/>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <StatusFilter value={filters.statusId} onChange={(value) => setFilters('statusId', value)}/>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}