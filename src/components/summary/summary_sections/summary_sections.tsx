'use client'
import React from "react";
import SummaryBase from "../summary_base"
import SummarySection from "./summary_section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, Valuable, Section } from "@/types/collections";
import { useURLMetadata } from "@/hooks/url_metadata.hook";
import { useQuery } from "@tanstack/react-query";
import { sectionKeys } from "@/lib/query_keys";
import { getSections } from "@/server/sections/get_sections";
import { mergeValues } from "@/lib/merge_values";

type SummarySectionsProps = Valuable;

export default function SummarySections({ values }: SummarySectionsProps) {
    const { collection } = useURLMetadata();

    const { data: sections } = useQuery({
        queryKey: sectionKeys.all(collection),
        queryFn: () => getSections({ collection }),
    })

    if (!sections || sections.length === 0) return null;

    const mergedSections = mergeValues(sections, values);

    return (
        <SummaryBase title='Details'>
            <Tabs defaultValue={sections[0].name}>
                <TabsList>
                    {mergedSections.map(section => (
                        <TabsTrigger
                            key={section._id}
                            value={section.name}>
                            {section.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {mergedSections.map(section => (
                    <TabsContent key={section._id} value={section.name}>
                        <SummarySection section={section} />
                    </TabsContent>
                ))}
            </Tabs>
        </SummaryBase>
    )
}
