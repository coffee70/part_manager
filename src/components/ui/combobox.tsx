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
    multiple?: boolean;
}

function useCombobox({ options, multiple }: Props) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const [selected, _setSelected] = React.useState<Option[]>([])
    const setSelected = (id: number) => {
        if (multiple) {
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
        } else {
            const option = options.find(o => o.id === id)
            if (option) {
                _setSelected([option])
            }
        }
    }
    const inputRef = React.useRef<HTMLInputElement>(null)
    const filteredOptions = options.filter(option => option.value.toLowerCase().includes(search.toLowerCase()))
    const handleSelect = ({ id, value }: Option) => {
        setSearch(multiple ? '' : value);
        setSelected(id);
    }
    const handleRemove = ({ id }: Option) => {
        setSelected(id)
    }
    const handleFocus = () => {
        inputRef.current?.focus();
        setOpen(true);
    }
    const handleBlur = () => {
        inputRef.current?.blur();
        setOpen(false);
    }

    return {
        open,
        search,
        setSearch,
        selected,
        inputRef,
        filteredOptions,
        handleSelect,
        handleRemove,
        handleFocus,
        handleBlur,
    }
}

export function Select({ options, multiple }: Props) {
    const {
        open,
        search,
        setSearch,
        selected,
        inputRef,
        filteredOptions,
        handleSelect,
        handleRemove,
        handleFocus,
        handleBlur,
    } = useCombobox({ options, multiple })

    return (
        <ClickAwayListener onClickAway={handleBlur}>
            <SelectBase>
                <SelectTrigger className={cn('group', open ? 'border-border' : 'hover:border-border')}>
                    {multiple && selected.length > 0 && selected.map(option => (
                        <Badge key={option.id} label={option.value} onClick={() => handleRemove(option)} />
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
                </SelectTrigger>
                {open && filteredOptions.length > 0 && (
                    <SelectContent>
                        {filteredOptions.map(option => (
                            <SelectItem key={option.id} onClick={() => handleSelect(option)}>
                                <span>{option.value}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                )}
            </SelectBase>
        </ClickAwayListener>
    )
}

type SelectBaseProps = {
    children: React.ReactNode;
}
const SelectBase = React.forwardRef<HTMLDivElement, SelectBaseProps>(({ children }, ref) => {
    return (
        <div ref={ref} className='relative'>
            {children}
        </div>
    )
})
SelectBase.displayName = 'SelectBase'


type SelectTriggerProps = {
    children: React.ReactNode;
    className?: string;
}

function SelectTrigger({ children, className }: SelectTriggerProps) {
    return (
        <div className={cn('flex items-center space-x-1 pl-1 border border-transparent', className)}>
            {children}
        </div>
    )
}

type SelectContentProps = {
    children: React.ReactNode;
}

function SelectContent({ children }: SelectContentProps) {
    return (
        <ul className='absolute z-10 shadow-md bg-foreground border border-border mt-1 min-w-44 list-none'>
            {children}
        </ul>
    )
}

type SelectItemProps = {
    children: React.ReactNode;
    onClick?: () => void;
}

function SelectItem({ children, onClick }: SelectItemProps) {
    return (
        <li className='p-1 hover:bg-hover' onClick={onClick}>
            {children}
        </li>
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