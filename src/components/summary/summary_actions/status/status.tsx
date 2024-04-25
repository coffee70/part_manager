import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'
import ActionButton from '../action_button'

export default function Status() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <ActionButton action='Status' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>

                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}