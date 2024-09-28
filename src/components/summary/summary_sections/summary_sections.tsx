'use client'
import React from "react";
import SummaryBase from "../summary_base"
import SummarySection from "./summary_section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Section } from "./types";

type SummarySectionsProps = {
    sections: Array<Section>;
}

export default function SummarySections({ sections }: SummarySectionsProps) {
    return (
        <SummaryBase title='Details'>
            <Tabs defaultValue={sections[0].name}>
                <TabsList>
                    {sections.map(section => (
                        <TabsTrigger
                            key={section._id}
                            value={section.name}>
                            {section.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {sections.map(section => (
                    <TabsContent key={section._id} value={section.name}>
                        <SummarySection section={section} />
                    </TabsContent>
                ))}
            </Tabs>
        </SummaryBase>
    )
}
