import { SettingsIcon, UserIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { NavActions, NavBase, NavLogo, NavTabs } from "../../ui/nav";

export default function Navigation() {
    return (
        <NavBase>
            <NavLogo />
            <NavTabs>
                <span>Dashboard</span>
                <span className="underline underline-offset-2 underline-primary">Orders</span>
                <span>Parts</span>
                <span>Customers</span>
                <span>Batches</span>
                <span>Grinding</span>
                <span>Furnaces</span>
            </NavTabs>
            <NavActions>
                <Button variant='icon'>
                    <SettingsIcon />
                </Button>
                <Button variant='icon'>
                    <UserIcon />
                </Button>
            </NavActions>
        </NavBase>
    )
}