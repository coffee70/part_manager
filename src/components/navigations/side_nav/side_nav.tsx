import {
    FactoryIcon,
    FlameIcon,
    FlaskConicalIcon,
    HammerIcon,
    LayoutDashboardIcon,
    ListIcon,
    NotebookPenIcon,
    SettingsIcon,
    UserIcon
} from 'lucide-react'
import {
    NavBase,
    NavContent,
    NavFooter,
    NavItem,
    NavDivider,
} from '../../ui/side_nav'
import Profile from './profile'

export default function SideNavigation() {
    return (
        <NavBase>
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