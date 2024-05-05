'use client'
import React from "react"
import { PlusIcon } from "lucide-react"
import { Input as BaseInput } from "../ui/input";
import { EditableInput, EditableInputContent, EditableInputTrigger } from "../ui/edit_input";

// export default function AddRow({ label }: { label: string }) {
//     const [adding, setAdding] = React.useState(false);
//     const inputRef = React.useRef<HTMLInputElement>(null);

//     /**
//      * Set up event listener to remove input when it loses focus
//      */
//     React.useEffect(() => {
//         if (inputRef.current) {
//             inputRef.current.addEventListener("blur", () => {
//                 setAdding(false);
//             });
//         }
//     }, [])

//     /**
//      * Focus input when adding is true
//      */
//     React.useEffect(() => {
//         if (adding) {
//             inputRef.current?.focus();
//         }
//     }, [adding])

//     return adding ? (
//         <Input
//             ref={inputRef}
//             placeholder="Enter order number"
//             className="h-10"
//         />
//     ) : (
//         <button
//             className="flex items-center p-2 space-x-2 w-full border-x border-b border-border hover:bg-hover"
//             onClick={() => setAdding(true)}
//         >
//             <PlusIcon />
//             <span>{label}</span>
//         </button>
//     )
// }

type TriggerProps = {
    label: string;
}

const Trigger = ({ label }: TriggerProps) => {
    return (
        <div className="flex items-center space-x-2 w-full px-2 h-10 border-x border-b border-border hover:bg-hover">
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
