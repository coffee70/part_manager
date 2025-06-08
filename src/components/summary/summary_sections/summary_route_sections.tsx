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

    const { data: routeFieldData } = useQuery({
        queryKey: routeKeys.routeFieldValues(modelId, instanceId, stepId),
        queryFn: () => getRouteFieldValues({ modelId, modelInstanceId: instanceId, stepId }),
    })

    if (!routeFieldData || !routeFieldData.sections || routeFieldData.sections.length === 0) return null;

    const { sections, values, kv_values } = routeFieldData;

    return (
        <SummaryBase title='Details'>
            <Tabs key={sections[0]._id} defaultValue={sections[0]._id}>
                <TabsList>
                    {sections.map(section => (
                        <TabsTrigger
                            key={section._id}
                            value={section._id}>
                            {section.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {sections.map(section => (
                    <TabsContent key={section._id} value={section._id}>
                        <SummaryRouteSection 
                            section={section} 
                            values={values}
                            kv_values={kv_values}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </SummaryBase>
    )
}
