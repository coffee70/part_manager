'use client'
import React from 'react';
import SummaryBase from '../summary_base';
import { EditableTextarea, EditableTextareaContent, EditableTextareaTrigger, useEditableTextareaContext } from '@/components/ui/edit_textarea';
import { Textarea as BaseTextarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckIcon, PencilIcon } from 'lucide-react';

type TriggerProps = {
    value: string;
}

const Trigger = ({ value }: TriggerProps) => {
    const { setIsEditing } = useEditableTextareaContext();
    return (
        <div
            className="group flex justify-between min-h-24 border border-transparent hover:border-foreground"
            onClick={() => setIsEditing(true)}
        >
            <span className='px-1'>{value}</span>
            <Button variant='icon' className='bg-foreground p-1 invisible group-hover:visible'>
                <PencilIcon />
            </Button>
        </div>
    )
}

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => {
    return (
        <div className='flex justify-between border border-border'>
            <BaseTextarea className='px-1' ref={ref} {...props} />
            <Button variant='icon' className='bg-foreground p-1'>
                <CheckIcon />
            </Button>
        </div>
    )
})
Textarea.displayName = 'Textarea';

type SummaryNotesProps = {
    value: string;
}

export default function SummaryNotes({ value }: SummaryNotesProps) {
    const [_value, _setValue] = React.useState<string>(value);

    return (
        <SummaryBase title="Notes">
            <EditableTextarea>
                <EditableTextareaTrigger>
                    <Trigger value={_value} />
                </EditableTextareaTrigger>
                <EditableTextareaContent>
                    <Textarea value={_value} onChange={(e) => _setValue(e.target.value)} />
                </EditableTextareaContent>
            </EditableTextarea>
        </SummaryBase>
    )
}