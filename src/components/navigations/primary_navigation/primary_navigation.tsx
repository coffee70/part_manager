'use client'
import React from "react";
import { RouteIcon, PrimaryUserIcon, PrimaryModelIcon } from "@/components/ui/icons/icons";
import { PrimaryDivider, PrimaryGroup, PrimaryHeader, PrimaryItem, PrimarySeparator } from "./components";
import { router } from "@/lib/url";
import { useURL } from "@/hooks/url_metadata.hook";
import Profile from "./profile";

export default function PrimaryNavigation() {
    const { headSegment } = useURL();
    return (
        <div className="h-screen w-fit bg-stone-100 border-r border-stone-200 px-1.5 py-4 flex flex-col shadow-sm">
            <PrimaryHeader />
            <PrimaryDivider />
            <PrimaryGroup>
                <PrimaryItem
                    id="models_primary_navigation"
                    context="models"
                    href={router().models().base()}
                >
                    <PrimaryModelIcon
                        size={24}
                        selected={headSegment === "models"}
                    />
                </PrimaryItem>
                <PrimaryItem
                    id="routers_primary_navigation"
                    context="routers"
                    href={"<ROUTER ROUTE HERE>"}
                >
                    <RouteIcon size={24} selected={headSegment === "routers"} />
                </PrimaryItem>
            </PrimaryGroup>
            <PrimaryDivider />
            <PrimaryGroup>
                <PrimaryItem
                    id="users_primary_navigation"
                    context="users"
                    href={router().users().base()}
                >
                    <PrimaryUserIcon size={24} selected={headSegment === "users"} />
                </PrimaryItem>
            </PrimaryGroup>
            <PrimarySeparator />
            <PrimaryGroup>
                <Profile />
            </PrimaryGroup>
        </div>
    )
}