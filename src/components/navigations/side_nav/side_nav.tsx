import { NavBase, NavContent, NavDivider, NavHeader, NavItem, SubNav, SubNavItem } from "@/components/ui/side_nav";
import {
    AlignLeftIcon,
    Building2Icon,
    DraftingCompassIcon,
    FactoryIcon,
    GalleryHorizontalEndIcon,
    HammerIcon,
    RouteIcon,
    UserIcon
} from "lucide-react";
import Profile from "./profile";
import Logo from "@/components/ui/logo";

export default function SideNavigation() {
    return (
        <NavBase>
            <NavHeader>
                <Logo />
            </NavHeader>
            <NavDivider />
            <NavContent>
                <NavItem label='Customer Orders' href='/customer-orders' icon={<GalleryHorizontalEndIcon />} />
                <NavItem label='Shop Orders' href='/shop-orders' icon={<FactoryIcon />} />
                <NavItem label='Parts' href='/parts' icon={<DraftingCompassIcon />} />
                <NavItem label='Serials' href='/serials' icon={<HammerIcon />} />
                <NavItem label='Customers' href='/customers' icon={<Building2Icon />} />
            </NavContent>
            <NavDivider />
            <NavContent>
                <SubNav label="Fields" icon={<AlignLeftIcon />}>
                    <SubNavItem label="Customer Orders" href='/fields/customer-orders' top />
                    <SubNavItem label="Shop Orders" href='/fields/shop-orders' />
                    <SubNavItem label="Parts" href='/fields/parts' />
                    <SubNavItem label="Serials" href='/fields/serials' bottom />
                </SubNav>
                <NavItem label='Users' href='/users' icon={<UserIcon />} />
            </NavContent>
            <NavDivider bottom />
            <NavContent>
                <Profile />
            </NavContent>
        </NavBase>
    )
}