import { Priority, priorityInfo } from "@/types/collections";

type Props = {
    priority: Priority;
}

export default function PriorityItem({ priority }: Props) {
    const { color, Icon } = priorityInfo[priority];
    return (
        <div className='flex items-center space-x-3'>
            <Icon style={{ color: color }} size={20} strokeWidth={2.5}/>
            <span>{priority}</span>
        </div>
    )
}