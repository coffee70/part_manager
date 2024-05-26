'use client'
import React from 'react';
import SummaryBase from '../summary_base';
import Textarea from '@/components/fields/textarea';

type SummaryNotesProps = {
    placeholder?: string;
}

export default function SummaryNotes({ placeholder }: SummaryNotesProps) {
    return (
        <SummaryBase title="Notes">
            <Textarea placeholder={placeholder}/>
        </SummaryBase>
    )
}