'use client'
import React from 'react';
import { Input } from '@/components/ui/input';
import { PlusIcon } from 'lucide-react';

type Props = {
    label: string;
    placeholder: string;
}

export default function AddItemForm({ label, placeholder }: Props) {
    const [adding, setAdding] = React.useState(false);
    const [value, setValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleAdd = React.useCallback(() => {
        setAdding(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [inputRef]);

    return (
        <div className='flex items-center border-t border-foreground py-1'>
            {adding ? (
                <Input
                    ref={inputRef}
                    placeholder={placeholder}
                    onBlur={() => setAdding(false)}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
            ) : (
                <button
                    type="button"
                    className="flex items-center space-x-1 w-full text-muted-foreground"
                    onClick={handleAdd}
                >
                    <PlusIcon />
                    <span>{label}</span>
                </button>
            )}
        </div>
    )
}