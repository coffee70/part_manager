'use client'
import React from "react";
import { Context } from "../components/navigations/nav/nav";
import CustomerSideNavigation from "../components/navigations/side_nav/customers_side_nav";
import ShopSideNavigation from "../components/navigations/side_nav/shop_side_nav";
import Navigation from "../components/navigations/nav/nav";

type Props = {
    children: React.ReactNode;
}

export default function Main({ children }: Props) {
    const [context, setContext] = React.useState<Context>("Customers")
    return (
        <>
            <Navigation context={context} setContext={setContext} />
            <main style={{ height: 'calc(100vh - 80px)' }} className="flex">
                {context === "Customers" && <CustomerSideNavigation />}
                {context === "Shop" && <ShopSideNavigation />}
                {children}
            </main>
        </>
    )
}