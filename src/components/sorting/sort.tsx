import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon } from "lucide-react";
import { DataAction } from "../data_actions/data_action_button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import useSort, { SortOption } from "../../hooks/sort.hook";
import { SelectBase, SelectItem } from "../ui/select";

type SortFields = {
    number: SortOption;
    updatedAt: SortOption;
    statusId: SortOption;
}

type Props<T> = {
    sort: T;
    setSort: (key: keyof T) => void;
}

export default function Sort<T extends SortFields>({ sort, setSort }: Props<T>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <DataAction>
                    <ArrowDownUpIcon size={24} />
                </DataAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56">
                <SelectBase>
                    <SelectItem onClick={() => setSort('number')}>
                        <span>Order Number</span>
                        {sort.number === 'asc' && <ArrowUpIcon strokeWidth={1.5} size={20} />}
                        {sort.number === 'desc' && <ArrowDownIcon strokeWidth={1.5} size={20} />}
                    </SelectItem>
                    <SelectItem onClick={() => setSort('statusId')}>
                        <span>Status</span>
                        {sort.statusId === 'asc' && <ArrowUpIcon strokeWidth={1.5} size={20} />}
                        {sort.statusId === 'desc' && <ArrowDownIcon strokeWidth={1.5} size={20} />}
                    </SelectItem>
                    <SelectItem onClick={() => setSort('updatedAt')}>
                        <span>Updated</span>
                        {sort.updatedAt === 'asc' && <ArrowUpIcon strokeWidth={1.5} size={20} />}
                        {sort.updatedAt === 'desc' && <ArrowDownIcon strokeWidth={1.5} size={20} />}
                    </SelectItem>
                </SelectBase>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}