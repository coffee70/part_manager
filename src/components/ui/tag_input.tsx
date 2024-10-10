'use client'
import React, { use } from 'react';
import { ComboboxBadge } from '@/components/ui/badge';
import { Input as BaseInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onKeyDown'> & {
    value?: string[];
    onChange?: (tags: string[]) => void;
}

export default function TagInput({ value, onChange, className, ...props }: Props) {
    const [tags, setTags] = React.useState(value || []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const text = e.currentTarget.value;

        if (!text &&
            tags.length &&
            e.key === 'Backspace'
        ) {
            setTags(tags.slice(0, tags.length - 1));
        }

        if (text && e.key === 'Enter') {
            e.preventDefault();
            setTags([...tags, text]);
            onChange && onChange([...tags, text]);
            e.currentTarget.value = '';
        }
    }

    const handleRemove = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    }

    return (
        <div className={cn("inline-flex items-center flex-wrap", className)}>
            {tags.map(tag => (
                <ComboboxBadge key={tag} label={tag} onRemove={() => handleRemove(tag)} />
            ))}
            <BaseInput
                {...props}
                className='pl-1'
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}