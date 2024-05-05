'use client'
import React, { TextareaHTMLAttributes } from 'react';
import SummaryBase from '../summary_base';
import { EditableInput, EditableInputContent, EditableInputTrigger, useEditableInputContext } from '@/components/ui/edit_input';
import { Textarea as BaseTextarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckIcon, PencilIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type TriggerProps = {
    value: string;
}

const Trigger = ({ value }: TriggerProps) => {
    return (
        <div className="group flex justify-between min-h-24 border border-transparent hover:border-foreground">
            <span className='px-1'>{value}</span>
            <Button variant='icon' className='bg-foreground p-1 invisible group-hover:visible'>
                <PencilIcon />
            </Button>
        </div>
    )
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => {
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
            <EditableInput>
                <EditableInputTrigger>
                    <Trigger value={_value} />
                </EditableInputTrigger>
                <EditableInputContent>
                    <Textarea value={_value} onChange={(e) => _setValue(e.target.value)} />
                </EditableInputContent>
            </EditableInput>
        </SummaryBase>
    )
}