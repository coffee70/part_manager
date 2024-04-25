import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ChevronsUpIcon, ChevronUpIcon, ChevronDownIcon, ChevronsDownIcon, MinusIcon } from 'lucide-react'
import PriorityItem from './priority_item'
import ActionButton from '../action_button'

const priorities = [
    { priority: 'Highest', icon: <ChevronsUpIcon className="text-red-600" size={20} strokeWidth={2.5}/> },
    { priority: 'High', icon: <ChevronUpIcon className="text-red-500" size={20} strokeWidth={2.5}/> },
    { priority: 'Medium', icon: <MinusIcon className="text-yellow-500" size={20} strokeWidth={2.5}/> },
    { priority: 'Low', icon: <ChevronDownIcon className="text-green-500" size={20} strokeWidth={2.5}/> },
    { priority: 'Lowest', icon: <ChevronsDownIcon className="text-green-600" size={20} strokeWidth={2.5}/> },
]

export default function Priority() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <ActionButton action='Priority' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {priorities.map((item, index) => (
                        <DropdownMenuItem key={index}>
                            <PriorityItem priority={item.priority} icon={item.icon} />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}