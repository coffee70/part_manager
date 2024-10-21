'use client'
import React from 'react';
import SummaryBase from '../summary_base';
import Notes from './notes';

type SummaryNotesProps = {
    initialValue?: string;
}

export default function SummaryNotes({ initialValue }: SummaryNotesProps) {

    return (
        <SummaryBase title="Notes">
            <Notes initialValue={initialValue} />
        </SummaryBase>
    )
}