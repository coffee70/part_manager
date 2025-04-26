'use client'
import React from "react";
import SummaryBase from "@/components/summary/summary_base"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModelInstanceRoutingURL } from "@/hooks/url_metadata.hook";
import { useQuery } from "@tanstack/react-query";
import { routeKeys } from "@/lib/query_keys";
import { getRouteFieldValues } from "@/server/routes/get_route_field_values";
import SummaryRouteSection from "@/components/summary/summary_sections/summary_route_section";

export default function SummaryRouteSections() {
    const { modelId, instanceId, stepId } = useModelInstanceRoutingURL();

    const { data: routeFieldSections } = useQuery({
        queryKey: routeKeys.routeFieldValues(modelId, instanceId, stepId),
        queryFn: () => getRouteFieldValues({ modelId, modelInstanceId: instanceId, stepId }),
    })

    if (!routeFieldSections || routeFieldSections.length === 0) return null;

    return (
        <SummaryBase title='Details'>
            <Tabs defaultValue={routeFieldSections[0]._id}>
                <TabsList>
                    {routeFieldSections.map(section => (
                        <TabsTrigger
                            key={section._id}
                            value={section._id}>
                            {section.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {routeFieldSections.map(section => (
                    <TabsContent key={section._id} value={section._id}>
                        <SummaryRouteSection section={section} />
                    </TabsContent>
                ))}
            </Tabs>
        </SummaryBase>
    )
}
