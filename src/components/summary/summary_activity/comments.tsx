'use client'
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import ActionButtons from '../summary_notes/action_buttons';

const PLACEHOLDER = "Add a comment..."

export default function Comments() {
    const [showActions, setShowActions] = React.useState(false);
    const [value, setValue] = React.useState("");
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const handleSave = () => {
        console.log('Save');
    }

    const handleCancel = () => {
        if (textareaRef.current) {
            textareaRef.current.value = '';
            textareaRef.current.blur();
        }
    }

    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.addEventListener('focus', () => setShowActions(true));
            textareaRef.current.addEventListener('blur', () => setShowActions(false));
        }
    })

    return (
        <>
        <div className="flex flex-col space-y-2">
        <span>There are no comments yet.</span>
        <div className='border-b border-b-foreground h-6'></div>
        <Textarea
            ref={textareaRef}
            className='px-2 py-1 border border-muted-foreground placeholder:text-muted-foreground'
            placeholder={PLACEHOLDER}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
        <ActionButtons
            onCancel={handleCancel}
            onSave={handleSave}
            show={showActions}
        />
    </div>
    </>
    )
}