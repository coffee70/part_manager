import {
    FlameIcon,
    FlaskConicalIcon,
    GalleryHorizontalEndIcon,
    HammerIcon,
    SettingsIcon
} from 'lucide-react'
import {
    NavBase,
    NavContent,
    NavFooter,
    NavItem,
    NavDivider,
} from '../../ui/side_nav'
import Profile from './profile'

export default function ShopSideNavigation() {
    return (
        <NavBase>
            <NavContent>
                <NavItem label='Shop Orders' icon={<GalleryHorizontalEndIcon />} />
                <NavItem label='Serials' icon={<HammerIcon />} />
                <NavItem label='Batches' icon={<FlaskConicalIcon />} />
                <NavItem label='Furnaces' icon={<FlameIcon />} />
            </NavContent>
            <NavDivider bottom />
        </NavBase>
    )
}