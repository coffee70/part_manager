'use client'
import React from "react";
import { FieldIcon, SecondaryRouteIcon } from "@/components/ui/icons/icons";
import { SecondaryGenericItem, SecondaryGroup, SecondaryItem } from "./components";
import { routerKeys } from "@/lib/query_keys";
import { useQuery } from "@tanstack/react-query";
import { router as appRouter } from "@/lib/url";
import { useURL } from "@/hooks/url_metadata.hook";
import { getRouters } from "@/server/routers/get_routers";

export default function RouterNavigation() {
    const { contextId } = useURL();
    const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

    const { data: routers = [] } = useQuery({
        queryKey: routerKeys.all(),
        queryFn: () => getRouters(),
    })

    return (
        <div className="shrink-0 w-60 bg-stone-100 border-r border-stone-200 overflow-y-auto">
            <div className="py-5 px-4">
                <h2 className="font-medium text-stone-800">Routers</h2>
            </div>
            <SecondaryGroup
                label="Routers"
                context="routers"
            >
                {routers.map((router, index) => (
                    <SecondaryGenericItem
                        key={router._id}
                        label={router.name}
                        href={appRouter().routers().instances().router(router._id)}
                        top={index === 0}
                        bottom={index === routers.length - 1}
                        selected={contextId === router._id}
                        context="routers"
                        onMouseEnter={() => setHoveredItem(router.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                        isHovered={hoveredItem === router.name}
                    />
                ))}
            </SecondaryGroup>
            <SecondaryGroup
                label="Admin"
                context="routers"
            >
                <SecondaryItem
                    id='routers_fields_secondary_navigation'
                    href={appRouter().routers().admin().fields().base()}
                    onMouseEnter={() => setHoveredItem("Fields")}
                    onMouseLeave={() => setHoveredItem(null)}
                    selected={contextId === "fields"}
                    isHovered={hoveredItem === "Fields"}
                >
                    <FieldIcon size={18} />
                    <span>Fields</span>
                </SecondaryItem>
                <SecondaryItem
                    id='routers_routerss_secondary_navigation'
                    href={appRouter().routers().admin().routers()}
                    onMouseEnter={() => setHoveredItem("Routers")}
                    onMouseLeave={() => setHoveredItem(null)}
                    selected={contextId === "routers"}
                    isHovered={hoveredItem === "Routers"}
                >
                    <SecondaryRouteIcon size={18} />
                    <span>Routers</span>
                </SecondaryItem>
            </SecondaryGroup>
        </div>
    )
}