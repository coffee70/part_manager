type Props = {
    priority: string;
    icon: React.ReactNode;
}

export default function PriorityItem({ priority, icon }: Props) {
    return (
        <div className='flex items-center space-x-3'>
            {icon}
            <span>{priority}</span>
        </div>
    )
}