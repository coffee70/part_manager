'use client'
import React from "react";
import { RouteIcon, PrimaryUserIcon, PrimaryModelIcon } from "@/components/ui/icons/icons";
import { PrimaryDivider, PrimaryGroup, PrimaryHeader, PrimaryItem, PrimarySeparator } from "./components";
import { router } from "@/lib/url";
import { useURL } from "@/hooks/url_metadata.hook";
import Profile from "./profile";
import { Role } from "@/types/collections";

type Props = {
    role: Role;
}

export default function PrimaryNavigation({ role }: Props) {
    const { context } = useURL();
    return (
        <div className="h-screen w-fit nav-surface px-1.5 py-4 flex flex-col">
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
                        selected={context === "models"}
                    />
                </PrimaryItem>
                <PrimaryItem
                    id="routers_primary_navigation"
                    context="routers"
                    href={router().routers().base()}
                >
                    <RouteIcon size={24} selected={context === "routers"} />
                </PrimaryItem>
            </PrimaryGroup>
            {role === "admin" && (
                <>
                    <PrimaryDivider />
                    <PrimaryGroup>
                        <PrimaryItem
                            id="users_primary_navigation"
                            context="users"
                            href={router().users().base()}
                        >
                            <PrimaryUserIcon size={24} selected={context === "users"} />
                        </PrimaryItem>
                    </PrimaryGroup>
                </>
            )}
            <PrimarySeparator />
            <PrimaryGroup>
                <Profile />
            </PrimaryGroup>
        </div>
    )
}