import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon } from "lucide-react";
import { DataAction } from "../data_actions/data_action_button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import useSort from "../../hooks/sort/sort.hook";
import { SelectBase, SelectItem } from "../ui/select";

export default function Sort() {
    const { sort, handleSortChange } = useSort();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <DataAction>
                    <ArrowDownUpIcon size={24} />
                </DataAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56">
                <SelectBase>
                    <SelectItem onClick={() => handleSortChange('order_number')}>
                        <span>Order Number</span>
                        {sort.order_number === 'asc' && <ArrowUpIcon strokeWidth={1.5} size={20} />}
                        {sort.order_number === 'desc' && <ArrowDownIcon strokeWidth={1.5} size={20} />}
                    </SelectItem>
                    <SelectItem onClick={() => handleSortChange('status')}>
                        <span>Status</span>
                        {sort.status === 'asc' && <ArrowUpIcon strokeWidth={1.5} size={20} />}
                        {sort.status === 'desc' && <ArrowDownIcon strokeWidth={1.5} size={20} />}
                    </SelectItem>
                    <SelectItem onClick={() => handleSortChange('updated_at')}>
                        <span>Updated</span>
                        {sort.updated_at === 'asc' && <ArrowUpIcon strokeWidth={1.5} size={20} />}
                        {sort.updated_at === 'desc' && <ArrowDownIcon strokeWidth={1.5} size={20} />}
                    </SelectItem>
                </SelectBase>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}