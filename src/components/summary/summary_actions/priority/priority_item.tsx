import { Priority } from "@/types/types";

type Props = {
    priority: Priority;
}

export default function PriorityItem({ priority }: Props) {
    const { label, color, Icon } = priority;
    return (
        <div className='flex items-center space-x-3'>
            <Icon style={{ color: color }} size={20} strokeWidth={2.5}/>
            <span>{label}</span>
        </div>
    )
}