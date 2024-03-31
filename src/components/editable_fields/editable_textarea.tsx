'use client'
import React from 'react';
import { Textarea } from '../ui/textarea';
import { PencilIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLACEHOLDER = 'Click to add notes';

type Props = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
}

export default function EditableTextarea({ value, onChange, onFocus, onBlur }: Props) {
    const [hovered, setHovered] = React.useState<boolean>(false);
    const [focused, setFocused] = React.useState<boolean>(false);

    const handleFocus = React.useCallback(() => {
        setFocused(true);
        setHovered(false);
        onFocus();
    }, [onFocus]);

    const handleBlur = React.useCallback(() => {
        setFocused(false);
        onBlur();
    }, [onBlur]);

    return (
        <div
            className={cn('flex border', hovered && !focused ? 'border-foreground' : 'border-transparent')}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Textarea
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur} 
                placeholder={PLACEHOLDER}
            ></Textarea>
            <button
                className={cn('bg-foreground p-1', hovered && !focused ? 'visible' : 'invisible')}
                onClick={handleFocus}
            >
                <PencilIcon />
            </button>
        </div>
    );
}