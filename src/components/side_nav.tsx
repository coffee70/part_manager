import {
    CircleUserIcon,
    FactoryIcon,
    FlameIcon,
    FlaskConicalIcon,
    HammerIcon,
    LayoutDashboardIcon,
    ListIcon,
    MoreHorizontalIcon,
    NotebookPenIcon,
    SettingsIcon,
    UserIcon
} from 'lucide-react'
import {
    NavBase,
    NavHeader,
    NavContent,
    NavFooter,
    NavItem,
    NavDivider,
} from './ui/nav'
import Image from 'next/image'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuItem
} from './ui/dropdown-menu'

export default function SideNavigation() {
    return (
        <NavBase>
            <NavHeader>
                <Image src='/logo.svg' width={200} height={50} alt='logo' />
            </NavHeader>
            <NavDivider />
            <NavContent>
                <NavItem label='Dashboard' icon={<LayoutDashboardIcon />} />
                <NavItem label='Parts' icon={<HammerIcon />} />
                <NavItem label='Orders' icon={<ListIcon />} />
                <NavItem label='Customers' icon={<UserIcon />} />
                <NavItem label='Batches' icon={<FlaskConicalIcon />} />
                <NavItem label='Grinding' icon={<FactoryIcon />} />
                <NavItem label='Furnaces' icon={<FlameIcon />} />
                <NavItem label='Logs' icon={<NotebookPenIcon />} />
            </NavContent>
            <NavDivider bottom />
            <NavFooter>
                <NavItem label='Settings' icon={<SettingsIcon />} />
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
                                <DropdownMenuItem className='flex items-center justify-center w-full h-full border border-red-700 text-red-700 font-bold cursor-pointer focus-visible:bg-red-700 focus-visible:text-white'>
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </NavFooter>
        </NavBase>
    )
}