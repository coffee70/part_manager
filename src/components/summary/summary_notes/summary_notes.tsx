'use client'
import React from 'react';
import EditableTextarea from '@/components/editable_fields/editable_textarea';
import SummaryBase from '../summary_base';
import ActionButtons from '@/components/summary/summary_notes/action_buttons';

export default function SummaryNotes() {
    const [value, setValue] = React.useState<string>('');

    return (
        <SummaryBase title="Notes">
            <EditableTextarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </SummaryBase>
    )
}