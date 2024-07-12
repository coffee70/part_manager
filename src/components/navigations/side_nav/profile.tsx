import {
    CircleUserIcon,
    MoreHorizontalIcon
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../../ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function Profile() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='icon'>
                    <CircleUserIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56">
                <DropdownMenuGroup>
                    <div className='flex space-x-2 p-2'>
                        <CircleUserIcon size={48} strokeWidth={1} />
                        <div className='flex flex-col'>
                            <span className='text-lg'>Jane Doe</span>
                            <span className='text-xs'>Ceramics Engineer</span>
                        </div>
                    </div>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className='flex items-center justify-center w-full h-full border border-red-700 text-red-700 font-bold cursor-pointer focus-visible:bg-red-700 focus-visible:text-white'>
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}