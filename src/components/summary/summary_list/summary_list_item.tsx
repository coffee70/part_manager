import { TData } from "@/api/data";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { More } from "@/components/ui/more";
import { MoreHorizontalIcon } from "lucide-react";

type Props = {
    point: TData[number];
}

export default function SummaryListItem({ point }: Props) {
    return (
        <div key={point.id} className='flex items-center justify-between flex-1 py-1 border-t border-foreground'>
            <div className="text-primary cursor-pointer hover:underline hover:underline-offset-2">{point.label}</div>
            <div className='flex items-center space-x-2'>
                <Badge color={point.status.color} label={point.status.label} />
                <More />
            </div>
        </div>
    )
}