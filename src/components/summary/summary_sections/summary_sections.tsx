'use client'
import React from "react";
import SummaryBase from "../summary_base"
import SummarySection from "./summary_section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Valuable } from "@/types/collections";
import { useInstanceURL } from "@/hooks/url_metadata.hook";
import { useQuery } from "@tanstack/react-query";
import { sectionKeys } from "@/lib/query_keys";
import { getSections } from "@/server/sections/get_sections";
import { mergeValues } from "@/lib/merge_values";

type SummarySectionsProps = Valuable;

export default function SummarySections({ values }: SummarySectionsProps) {
    const { modelId } = useInstanceURL();

    const { data: sections } = useQuery({
        queryKey: sectionKeys.all(modelId),
        queryFn: () => getSections({ modelId }),
    })

    if (!sections || sections.length === 0) return null;

    const mergedSections = mergeValues(sections, values);

    return (
        <SummaryBase title='Details'>
            <Tabs defaultValue={sections[0]._id}>
                <TabsList>
                    {mergedSections.map(section => (
                        <TabsTrigger
                            key={section._id}
                            value={section._id}>
                            {section.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {mergedSections.map(section => (
                    <TabsContent key={section._id} value={section._id}>
                        <SummarySection section={section} />
                    </TabsContent>
                ))}
            </Tabs>
        </SummaryBase>
    )
}
