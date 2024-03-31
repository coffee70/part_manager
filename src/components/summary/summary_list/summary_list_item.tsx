import { TData } from "@/api/orderData";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";

type Props = {
    point: TData[number];
}

export default function SummaryListItem({ point }: Props) {
    return (
        <div key={point.id} className='flex items-center justify-between border-t border-foreground'>
            <div>{point.label}</div>
            <div className='flex items-center space-x-2'>
                <Badge color={point.status.color} label={point.status.label} />
                <Button variant='table' size='sm_icon'>
                    <MoreHorizontalIcon />
                </Button>
            </div>
        </div>
    )
}