'use client'
import React from 'react';
import { Input } from '@/components/ui/input';
import { CheckIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className='border-t border-foreground'>
            {adding ? (
                <div className='flex items-center'>
                    <Input
                        className='py-1'
                        ref={inputRef}
                        placeholder={placeholder}
                        onBlur={() => setAdding(false)}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                    <Button variant='icon' className='bg-foreground p-1'>
                        <CheckIcon />
                    </Button>
                </div>
            ) : (
                <button
                    type="button"
                    className="flex items-center space-x-1 w-full py-1 text-muted-foreground"
                    onClick={handleAdd}
                >
                    <PlusIcon />
                    <span>{label}</span>
                </button>
            )}
        </div>
    )
}