import { StatusBadge } from "@/components/ui/badge";
import { More } from "@/components/ui/more";
import { Item } from "./summary_list";

type Props = {
    item: Item;
}

export default function SummaryListItem({ item }: Props) {
    return (
        <div key={item.id} className='flex items-center justify-between flex-1 py-1 border-t border-foreground'>
            <div className="text-primary cursor-pointer hover:underline hover:underline-offset-2">{item.label}</div>
            <div className='flex items-center space-x-2'>
                <StatusBadge color={item.status.color} label={item.status.label} />
                <More />
            </div>
        </div>
    )
}