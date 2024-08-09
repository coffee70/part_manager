'use client'
import React from "react";
import SummaryBase from "../summary_base"
import DetailBase from "./summary_detail_base";
import Field from "@/components/ui/field";
import { Detail } from "@/types/types";
import AddField from "./add_field/add_field";

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
                            <div className='text-muted-foreground text-nowrap'>{`${detail.label}:`}</div>
                            <Field value={detail.value} />
                        </DetailBase>
                    ))}
                    <AddField />
                </div>
            </div>
        </SummaryBase>
    )
}

