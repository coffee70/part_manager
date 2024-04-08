'use client'
import React from 'react';
import EditableTextarea from '@/components/editable_fields/editable_textarea';
import Summary from '../summary_base';
import ActionButtons from '@/components/summary/summary_notes/action_buttons';

export default function SummaryNotes() {
    const [value, setValue] = React.useState<string>('');
    const [focused, setFocused] = React.useState<boolean>(false);

    const handleSubmit = React.useCallback(() => {
        // POST request to save notes
        setFocused(false);
    }, []);

    return (
        <Summary title="Notes">
            <EditableTextarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            <ActionButtons
                onCancel={() => setFocused(false)}
                onSave={handleSubmit}
                show={focused}
            />
        </Summary>
    )
}