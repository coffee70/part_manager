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
} from '../ui/nav'
import Image from 'next/image'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuItem
} from '../ui/dropdown-menu'
import Profile from './profile'

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
                <Profile />
            </NavFooter>
        </NavBase>
    )
}