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

type SummarySectionsProps = Valuable;

export default function SummarySections({ values, kv_values }: SummarySectionsProps) {
    const { context, id } = useInstanceURL();

    const { data: sections } = useQuery({
        queryKey: sectionKeys.all(context, id),
        queryFn: () => getSections({ context, id }),
    })

    if (!sections || sections.length === 0) return null;

    return (
        <SummaryBase title='Details'>
            <Tabs defaultValue={sections[0]._id}>
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
                        <SummarySection 
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
