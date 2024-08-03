import {
    FlameIcon,
    FlaskConicalIcon,
    GalleryHorizontalEndIcon,
    HammerIcon,
} from 'lucide-react'
import {
    NavBase,
    NavContent,
    NavItem,
} from '../../ui/side_nav'

export default function ShopSideNavigation() {
    return (
        <NavBase>
            <NavContent>
                <NavItem label='Shop Orders' icon={<GalleryHorizontalEndIcon />} />
                <NavItem label='Serials' icon={<HammerIcon />} />
                <NavItem label='Batches' icon={<FlaskConicalIcon />} />
                <NavItem label='Furnaces' icon={<FlameIcon />} />
            </NavContent>
        </NavBase>
    )
}