'use client'
import React from "react"
import { PlusIcon } from "lucide-react"
import { Input as BaseInput } from "../ui/input";
import { EditableInput, EditableInputContent, EditableInputTrigger, useEditableInputContext } from "../ui/edit_input";

type TriggerProps = {
    label: string;
}

const Trigger = ({ label }: TriggerProps) => {
    const { setIsEditing } = useEditableInputContext();
    return (
        <div
            className="flex items-center space-x-2 w-full px-2 h-10 border-x border-b border-border cursor-pointer hover:bg-hover"
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
        <BaseInput
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="h-10 px-2 border-x border-b border-border"
            {...props}
        />
    )
})
Input.displayName = 'Input';

type AddRowProps = {
    label: string;
}
export default function AddRow({ label }: AddRowProps) {
    return (
        <EditableInput>
            <EditableInputTrigger>
                <Trigger label={label} />
            </EditableInputTrigger>
            <EditableInputContent>
                <Input placeholder="Enter order number" />
            </EditableInputContent>
        </EditableInput>
    )
}
