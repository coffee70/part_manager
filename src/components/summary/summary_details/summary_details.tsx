'use client'
import React from "react";
import SummaryBase from "../summary_base"
import DetailBase from "./summary_detail_base";
import DetailLabel from "./summary_detail_label";
import DetailValue from "./summary_detail_value";
import { Detail } from "@/types/types";

type SummaryDetailsProps = {
    details: Detail[];
}

export default function SummaryDetails({ details }: SummaryDetailsProps) {
    const ids = details.map(detail => detail.id)
    return (
        <SummaryBase title='Details'>
            <div className="flex">
                <div className='flex flex-col space-y-1 text-sm'>
                    {details.map(detail => (
                        <DetailBase key={detail.id}>
                            <DetailLabel label={detail.label} />
                            <DetailValue value={detail.value} />
                        </DetailBase>
                    ))}
                </div>
            </div>
        </SummaryBase>
    )
}

