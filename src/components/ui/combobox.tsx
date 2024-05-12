/**
 * Combobox component: A select option input that contains a input search
 * to narrow down the options and a list of options to select from.
 */
'use client'
import React from 'react'
import { Input } from './input';
import { CheckIcon, PencilIcon, XIcon } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { ClickAwayListener } from '@mui/base';

type Option = {
    id: number;
    value: string;
}

type Props = {
    options: Option[];
}

export function Multiselect({ options }: Props) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const [selected, _setSelected] = React.useState<Option[]>([])
    const setSelected = (id: number) => {
        _setSelected(prev => {
            const option = options.find(o => o.id === id)
            if (option) {
                if (prev.some(o => o.id === id)) {
                    return prev.filter(o => o.id !== id)
                } else {
                    return [...prev, option]
                }
            }
            return prev
        })
    }
    const inputRef = React.useRef<HTMLInputElement>(null)

    const filteredOptions = options.filter(option => option.value.toLowerCase().includes(search.toLowerCase()))

    const handleSelect = ({ id }: Option) => {
        setSearch('');
        setSelected(id);
    }

    const handleFocus = () => {
        inputRef.current?.focus();
        setOpen(true);
    }

    const handleBlur = () => {
        inputRef.current?.blur();
        setOpen(false);
    }

    return (
        <ClickAwayListener onClickAway={handleBlur}>
            <div className="relative">
                <div className={cn('group flex items-center space-x-1 pl-1 border border-transparent', open ? 'border-border' : 'hover:border-border')}>
                    {selected.length > 0 && selected.map(option => (
                        <Badge key={option.id} label={option.value} onClick={() => setSelected(option.id)} />
                    ))}
                    <Input
                        ref={inputRef}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={handleFocus}
                    />
                    {!open && (
                        <Button
                            variant='icon'
                            className='bg-foreground p-1 invisible group-hover:visible'
                            onClick={handleFocus}
                        >
                            <PencilIcon />
                        </Button>
                    )}
                    {open && (
                        <Button
                            variant='icon'
                            className='bg-foreground p-1'
                            onClick={handleBlur}
                        >
                            <CheckIcon />
                        </Button>
                    )}
                </div>
                {open && filteredOptions.length > 0 && <div className="absolute z-10 shadow-md bg-foreground border border-border mt-1 min-w-44">
                    <ul>
                        {filteredOptions.map(option => (
                            <li key={option.id} className='p-1 hover:bg-hover' onClick={() => handleSelect(option)}>
                                <span>{option.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>}
            </div>
        </ClickAwayListener>
    )
}

export function Select({ options }: Props) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const [selected, _setSelected] = React.useState<Option>()
    const setSelected = (id: number) => {
        const option = options.find(o => o.id === id)
        if (option) {
            _setSelected(option)
        }
    }
    const inputRef = React.useRef<HTMLInputElement>(null)

    const filteredOptions = options.filter(option => option.value.toLowerCase().includes(search.toLowerCase()))

    const handleSelect = ({ id, value }: Option) => {
        setSearch(value);
        setSelected(id);
    };

    const handleFocus = () => {
        inputRef.current?.focus();
        setOpen(true);
    }

    const handleBlur = () => {
        inputRef.current?.blur();
        setOpen(false);
    }

    return (
        <ClickAwayListener onClickAway={handleBlur}>
            <div className="relative">
                <div className={cn('group flex items-center space-x-1 pl-1 border border-transparent', open ? 'border-border' : 'hover:border-border')}>
                    <Input
                        ref={inputRef}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={handleFocus}
                    />
                    {!open && (
                        <Button
                            variant='icon'
                            className='bg-foreground p-1 invisible group-hover:visible'
                            onClick={handleFocus}
                        >
                            <PencilIcon />
                        </Button>
                    )}
                    {open && (
                        <Button
                            variant='icon'
                            className='bg-foreground p-1'
                            onClick={handleBlur}
                        >
                            <CheckIcon />
                        </Button>
                    )}
                </div>
                {open && filteredOptions.length > 0 && <div className="absolute z-10 shadow-md bg-foreground border border-border mt-1 min-w-44">
                    <ul>
                        {filteredOptions.map(option => (
                            <li key={option.id} className='p-1 hover:bg-hover' onClick={() => handleSelect(option)}>
                                <span>{option.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>}
            </div>
        </ClickAwayListener>
    )
}

type BadgeProps = {
    label: string;
    onClick: () => void;
}

function Badge({ label, onClick }: BadgeProps) {
    return (
        <div
            className="flex items-center justify-end rounded-sm text-xs text-white font-bold transition-colors"
            style={{ backgroundColor: 'grey' }}
            onClick={onClick}
        >
            <span className='px-1 py-0.5'>{label}</span>
            <button>
                <XIcon size={16} />
            </button>
        </div>
    )
}