'use client'
import React, { InputHTMLAttributes } from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon, PencilIcon } from 'lucide-react';
import { Input as BaseInput } from '@/components/ui/input';
import { EditableInput, EditableInputTrigger, EditableInputContent, useEditableInputContext } from '@/components/ui/edit_input';
import { cn } from '@/lib/utils';

type TriggerProps = {
    value: string;
}
const Trigger = ({ value }: TriggerProps) => {
    const { hovered } = useEditableInputContext();
    return (
        <div className={cn(
            "flex items-center justify-end border w-fit text-sm space-x-2 hover: border-foreground",
            hovered ? 'border-foreground' : 'border-transparent'
        )}>
            <div className="flex items-center justify-end space-x-2 pl-1 border border-transparent">{value}</div>
            <Button variant='icon' className={cn('bg-foreground p-1', !hovered ? 'invisible disabled' : '')}>
                <PencilIcon />
            </Button>
        </div>
    )
}

const Input = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
    return (
        <div className="flex items-center border border-border w-full">
            <BaseInput className='ml-1' ref={ref} {...props} />
            <Button variant='icon' className='bg-foreground p-1'>
                <CheckIcon />
            </Button>
        </div>
    )
});
Input.displayName = 'Input';

type DetailValueProps = {
    value: string;
}
export default function DetailValue({ value }: DetailValueProps) {
    const [_value, _setValue] = React.useState(value);
    return (
        <EditableInput>
            <EditableInputTrigger>
                <Trigger value={_value} />
            </EditableInputTrigger>
            <EditableInputContent>
                <Input value={_value} onChange={(e) => _setValue(e.target.value)} />
            </EditableInputContent>
        </EditableInput>
    )
}