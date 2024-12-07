import { CircleUserIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../../ui/dropdown-menu"
import Logout from "@/components/auth/logout"
import { More } from "@/components/ui/more"
import { getCurrentSession } from "@/server/auth/get_current_session"


export default async function Profile() {
    const { user } = await getCurrentSession();

    return (
        <div className='flex justify-between space-x-1 m-2 bg-neutral-400/30 p-2'>
            <div className='flex space-x-2'>
                <CircleUserIcon size={48} strokeWidth={1} />
                <div className='flex flex-col'>
                    <span className='text-lg'>{user?.name}</span>
                    <span className='text-xs'>{user?.title}</span>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className='focus-visible:outline-none'>
                    <More />
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