import {
    DraftingCompassIcon,
    GalleryHorizontalEndIcon,
    UserIcon
} from 'lucide-react'
import {
    NavBase,
    NavContent,
    NavItem,
} from '../../ui/side_nav'

export default function CustomerSideNavigation() {
    return (
        <NavBase>
            <NavContent>
                <NavItem label='Customer Orders' icon={<GalleryHorizontalEndIcon />} />
                <NavItem label='Parts' icon={<DraftingCompassIcon />} />
                <NavItem label='Customers' icon={<UserIcon />} />
            </NavContent>
        </NavBase>
    )
}