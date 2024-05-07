'use client'
import React from 'react';
import { Input as BaseInput } from '@/components/ui/input';
import { CheckIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableInput, EditableInputContent, EditableInputTrigger, useEditableInputContext } from '@/components/ui/edit_input';

type TriggerProps = {
    label: string;
}

const Trigger = ({ label }: TriggerProps) => {
    const { setIsEditing } = useEditableInputContext();
    return (
        <div
            className="flex items-center space-x-1 w-full py-1 text-muted-foreground cursor-pointer"
            onClick={() => setIsEditing(true)}
        >
            <PlusIcon />
            <span>{label}</span>
        </div>
    )
}

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ placeholder, ...props }, ref) => {
    const [value, setValue] = React.useState('');
    return (
        <div className='flex items-center'>
            <BaseInput
                className='py-1'
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                ref={ref}
                {...props} />
            <Button variant='icon' className='bg-foreground p-1'>
                <CheckIcon />
            </Button>
        </div>
    )
})
Input.displayName = 'Input';

type AddItemFormProps = {
    label: string;
    placeholder: string;
}

export default function AddItemForm({ label, placeholder }: AddItemFormProps) {
    return (
        <div className='border-t border-foreground'>
            <EditableInput>
                <EditableInputTrigger>
                    <Trigger label={label} />
                </EditableInputTrigger>
                <EditableInputContent>
                    <Input placeholder={placeholder} />
                </EditableInputContent>
            </EditableInput>
        </div>
    )
}