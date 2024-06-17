import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon } from "lucide-react";
import { DataAction } from "../data_actions/data_action_button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import useSort, { SortOption } from "../../hooks/sort.hook";
import { SelectBase, SelectItem } from "../ui/select";

type SortFields = {
    order_number: SortOption;
    status: SortOption;
    updated_at: SortOption;
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
                    <SelectItem onClick={() => setSort('order_number')}>
                        <span>Order Number</span>
                        {sort.order_number === 'asc' && <ArrowUpIcon strokeWidth={1.5} size={20} />}
                        {sort.order_number === 'desc' && <ArrowDownIcon strokeWidth={1.5} size={20} />}
                    </SelectItem>
                    <SelectItem onClick={() => setSort('status')}>
                        <span>Status</span>
                        {sort.status === 'asc' && <ArrowUpIcon strokeWidth={1.5} size={20} />}
                        {sort.status === 'desc' && <ArrowDownIcon strokeWidth={1.5} size={20} />}
                    </SelectItem>
                    <SelectItem onClick={() => setSort('updated_at')}>
                        <span>Updated</span>
                        {sort.updated_at === 'asc' && <ArrowUpIcon strokeWidth={1.5} size={20} />}
                        {sort.updated_at === 'desc' && <ArrowDownIcon strokeWidth={1.5} size={20} />}
                    </SelectItem>
                </SelectBase>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}