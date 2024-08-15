'use client'
import React from 'react';
import { ComboboxBadge } from '@/components/ui/badge';
import { Input as BaseInput } from '@/components/ui/input';

type Props = {
    placeholder?: string;
    value: string[];
    onChange: (options: string[]) => void;
}

export default function AddOptions({ placeholder, value, onChange }: Props) {
    const [input, setInput] = React.useState<string>('')

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onChange([...value, input]);
            setInput('')
        }
        if (e.key === 'Backspace' && input === '') {
            onChange(value.slice(0, value.length - 1))
        }
    }

    const handleRemove = (option: string) => {
        onChange(value.filter(v => v !== option))
    }

    return (
        <div className="flex flex-col">
            <span>Add Options</span>
            <div className="flex items-center space-x-1 border border-muted-foreground p-1">
                {value.map(option => (
                    <ComboboxBadge key={option} label={option} onRemove={() => handleRemove(option)} />
                ))}
                <BaseInput
                    placeholder={value.length === 0 ? placeholder : ''}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

        </div>
    )
}