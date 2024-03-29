import * as React from 'react';
import { PencilIcon } from "lucide-react";
import { Textarea, TextareaProps } from '@/components/ui/textarea';

export function EditableTextarea(props: TextareaProps) {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const handleEdit = () => {
        if (textareaRef.current !== null) {
            textareaRef.current.focus();
        }
    }

    return (
        <div className="flex">
            <Textarea ref={textareaRef} {...props} />
            <button className='bg-foreground' onClick={handleEdit}>
                <PencilIcon />
            </button>
        </div>
    )
}