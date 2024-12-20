import { NavBase, NavContent, NavDivider, NavHeader, NavItem, SubNav, SubNavItem } from "@/components/ui/side_nav";
import Profile from "./profile";
import Logo from "@/components/ui/logo";
import { CustomerIcon, CustomerOrderIcon, FieldIcon, ModelIcon, PartIcon, SerialIcon, ShopOrderIcon, UserIcon } from "@/components/ui/icons/icons";

export default function SideNavigation() {
    return (
        <NavBase>
            <NavHeader>
                <Logo />
            </NavHeader>
            <NavDivider />
            <NavContent>
                <NavItem label='Customer Orders' href='/customer-orders' icon={<CustomerOrderIcon />} />
                <NavItem label='Shop Orders' href='/shop-orders' icon={<ShopOrderIcon />} />
                <NavItem label='Parts' href='/parts' icon={<PartIcon />} />
                <NavItem label='Serials' href='/serials' icon={<SerialIcon />} />
                <NavItem label='Customers' href='/customers' icon={<CustomerIcon />} />
            </NavContent>
            <NavDivider />
            <NavContent>
                <NavItem label="Models" href="/models" icon={<ModelIcon />} />
                <SubNav label="Fields" icon={<FieldIcon />}>
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