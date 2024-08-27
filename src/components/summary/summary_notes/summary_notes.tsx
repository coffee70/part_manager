'use client'
import React from 'react';
import SummaryBase from '../summary_base';
import { StyledTextarea as Textarea } from '@/components/ui/textarea';

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