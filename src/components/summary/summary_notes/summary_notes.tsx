'use client'
import React from 'react';
import SummaryBase from '../summary_base';
import { StyledTextarea as Textarea } from '@/components/ui/textarea';

type SummaryNotesProps = {
    initialValue?: string;
}

export default function SummaryNotes({ initialValue }: SummaryNotesProps) {
    const [notes, setNotes] = React.useState(initialValue);

    return (
        <SummaryBase title="Notes">
            <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes..."
            />
        </SummaryBase>
    )
}