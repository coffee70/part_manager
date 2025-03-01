'use client'
import React from "react";
import { FieldIcon, SecondaryModelIcon } from "@/components/ui/icons/icons";
import { SecondaryGenericItem, SecondaryGroup, SecondaryItem } from "./components";
import { modelKeys } from "@/lib/query_keys";
import { getModels } from "@/server/models/get_models";
import { useQuery } from "@tanstack/react-query";
import { router } from "@/lib/url";
import { useURL } from "@/hooks/url_metadata.hook";

export default function ModelNavigation() {
    const { tailSegment } = useURL();
    const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

    const { data: models = [] } = useQuery({
        queryKey: modelKeys.all(),
        queryFn: () => getModels(),
    })

    return (
        <div className="shrink-0 w-60 bg-stone-100 border-r border-stone-200 overflow-y-auto">
            <div className="py-5 px-4">
                <h2 className="font-medium text-stone-800">Models</h2>
            </div>
            <SecondaryGroup
                label="Models"
                context="models"
            >
                {models.map((model, index) => (
                    <SecondaryGenericItem
                        key={model._id}
                        label={model.name}
                        href={router().models().instances().model(model._id)}
                        top={index === 0}
                        bottom={index === models.length - 1}
                        selected={tailSegment === model._id}
                        context="models"
                        onMouseEnter={() => setHoveredItem(model.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                        isHovered={hoveredItem === model.name}
                    />
                ))}
            </SecondaryGroup>
            <SecondaryGroup
                label="Admin"
                context="models"
            >
                <SecondaryItem
                    id='models_fields_secondary_navigation'
                    href={router().models().admin().fields().base()}
                    onMouseEnter={() => setHoveredItem("Fields")}
                    onMouseLeave={() => setHoveredItem(null)}
                    selected={tailSegment === "fields"}
                    isHovered={hoveredItem === "Fields"}
                >
                    <FieldIcon size={18} />
                    <span>Fields</span>
                </SecondaryItem>
                <SecondaryItem
                    id='models_models_secondary_navigation'
                    href={router().models().admin().models()}
                    onMouseEnter={() => setHoveredItem("Models")}
                    onMouseLeave={() => setHoveredItem(null)}
                    selected={tailSegment === "models"}
                    isHovered={hoveredItem === "Models"}
                >
                    <SecondaryModelIcon size={18} />
                    <span>Models</span>
                </SecondaryItem>
            </SecondaryGroup>
        </div>
    )
}