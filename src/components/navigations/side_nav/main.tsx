import { NavBase, NavContent, NavLogo, NavDivider, NavHeader, NavItem, SubNav, SubNavItem } from "@/components/ui/side_nav";
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

export default function SideNavigation() {
    return (
        <NavBase>
            <NavHeader>
                <NavLogo />
            </NavHeader>
            <NavDivider />
            <NavContent>
                <NavItem label='Customer Orders' icon={<GalleryHorizontalEndIcon />} />
                <NavItem label='Shop Orders' icon={<FactoryIcon />} />
                <NavItem label='Parts' icon={<DraftingCompassIcon />} />
                <NavItem label='Serials' icon={<HammerIcon />} />
                <NavItem label='Customers' icon={<Building2Icon />} />
            </NavContent>
            <NavDivider />
            <NavContent>
                <SubNav label="Fields" icon={<AlignLeftIcon />}>
                    <SubNavItem label="Customer Orders" top />
                    <SubNavItem label="Shop Orders" />
                    <SubNavItem label="Parts" />
                    <SubNavItem label="Serials" bottom />
                </SubNav>
                <SubNav label="Workflow" icon={<RouteIcon />}>
                    <SubNavItem label="Customer Orders" top />
                    <SubNavItem label="Shop Orders" />
                    <SubNavItem label="Parts" />
                    <SubNavItem label="Serials" bottom />
                </SubNav>
                <NavItem label='Users' icon={<UserIcon />} />
            </NavContent>
            <NavDivider bottom />
            <NavContent>
                <Profile />
            </NavContent>
        </NavBase>
    )
}