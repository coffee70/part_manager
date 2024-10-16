import { PriorityInfo } from "@/types/collections";

type Props = {
    priorityInfo: PriorityInfo;
}

export default function PriorityItem({ priorityInfo }: Props) {
    const { label, color, Icon } = priorityInfo;
    return (
        <div className='flex items-center space-x-3'>
            <Icon style={{ color: color }} size={20} strokeWidth={2.5}/>
            <span>{label}</span>
        </div>
    )
}