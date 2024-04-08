'use client'
import React from "react";
import SummaryBase from "../summary_base"
import { FocusProvider } from "./summary_details_context";
import EditableInput from "../../editable_fields/editable_input/editable_input";
import DetailBase from "./summary_detail_base";
import DetailClickAwayListener from "./summary_detail_CAL";

type Person = {
    name: string;
}

export type DetailT = {
    id: number;
    key: string;
    value: string | Person;
}

type SummaryDetailsProps = {
    details: DetailT[];
}

export default function SummaryDetails({ details }: SummaryDetailsProps) {
    const ids = details.map(detail => detail.id)
    return (
        <SummaryBase title='Details'>
            <div className="flex">
                <div className='flex flex-col space-y-1 text-sm'>
                    <FocusProvider ids={ids}>
                        {details.map(detail => (
                            <DetailClickAwayListener key={detail.id} detail={detail}>
                                <DetailBase detail={detail}>
                                    <EditableInput detail={detail} />
                                </DetailBase>
                            </DetailClickAwayListener>
                        ))}
                    </FocusProvider>
                </div>
            </div>
        </SummaryBase>
    )
}

