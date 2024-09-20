'use client'
import React from "react";
import SummaryBase from "../summary_base"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Section } from "./types";
import SummarySection from "./summary_section";

type SummarySectionsProps = {
    sections: Array<Section>
}

export default function SummarySections({ sections }: SummarySectionsProps) {
    return (
        <SummaryBase title='Details'>
            <Tabs defaultValue={sections[0].title}>
                <TabsList>
                    {sections.map(section => (
                        <TabsTrigger
                            key={section.id}
                            value={section.title}>
                            {section.title}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {sections.map(section => (
                    <TabsContent key={section.id} value={section.title}>
                        <SummarySection section={section} />
                    </TabsContent>
                ))}
            </Tabs>
        </SummaryBase>
    )
}
