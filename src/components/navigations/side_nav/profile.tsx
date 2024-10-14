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
import Logout from "@/components/auth/logout"


export default function Profile() {
    return (
        <div className='flex justify-between space-x-1 m-2 bg-neutral-400/30 p-2'>
            <div className='flex space-x-2'>
                <CircleUserIcon size={48} strokeWidth={1} />
                <div className='flex flex-col'>
                    <span className='text-lg'>Jane Doe</span>
                    <span className='text-xs'>Ceramics Engineer</span>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className='focus-visible:outline-none'>
                    <button className='flex flex-col'>
                        <MoreHorizontalIcon size={20} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                    <DropdownMenuGroup>
                        <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <Logout />
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}