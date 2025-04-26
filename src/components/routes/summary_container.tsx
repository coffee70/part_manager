'use client'
import SummaryRouteFieldValues from "@/components/summary/summary_sections/summary_route_sections";
import SummaryTitle from "@/components/summary/summary_title/summary_title";
import { SummaryContent, SummaryHeader } from "@/layouts/summary_layout";

export default function SummaryContainer() {
    return (
        <>
            <SummaryHeader>
                <SummaryTitle />
            </SummaryHeader>
            <SummaryContent>
                <SummaryRouteFieldValues />
            </SummaryContent>
        </>
    )
}   