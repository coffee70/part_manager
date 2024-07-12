import {
    DraftingCompassIcon,
    GalleryHorizontalEndIcon,
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

export default function CustomerSideNavigation() {
    return (
        <NavBase>
            <NavContent>
                <NavItem label='Customer Orders' icon={<GalleryHorizontalEndIcon />} />
                <NavItem label='Parts' icon={<DraftingCompassIcon />} />
                <NavItem label='Customers' icon={<UserIcon />} />
            </NavContent>
            <NavDivider bottom />
            <NavFooter>
                <NavItem label='Settings' icon={<SettingsIcon />} />
            </NavFooter>
        </NavBase>
    )
}