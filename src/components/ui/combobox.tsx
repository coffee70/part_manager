/**
 * Combobox component: A select option input that contains a input search
 * to narrow down the options and a list of options to select from.
 * 
 * The component is composed of a ComboboxBase, ComboboxTrigger, ComboboxContent, and ComboboxItem.
 * These components make the building blocks of the combobox component.
 */
'use client'
import React from 'react'
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClickAwayListener } from '@mui/base';
import { Input } from './input';
import { ComboboxBadge } from './badge';

export type Option = {
    id: number;
    value: string;
}

type Props = {
    options: Option[];
    multiple?: boolean;
    placeholder?: string;
}

/**
 * Internal combobox used throughout the application.
 */
export function Combobox({ options, multiple, placeholder }: Props) {
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
        <ComboboxBase onClickAway={handleBlur}>
            <ComboboxTrigger>
                {multiple && selected.length > 0 && selected.map(option => (
                    <ComboboxBadge key={option.id} label={option.value} onClick={() => handleRemove(option)} />
                ))}
                <Input
                    ref={inputRef}
                    className='px-1 border-2 border-muted-foreground'
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={handleFocus}
                />
            </ComboboxTrigger>
            {open && filteredOptions.length > 0 && (
                <ComboboxContent className='w-full'>
                    {filteredOptions.map(option => (
                        <ComboboxItem key={option.id} onClick={() => handleSelect(option)}>
                            {option.value}
                        </ComboboxItem>
                    ))}
                </ComboboxContent>
            )}
        </ComboboxBase>
    )
}

export function useCombobox({
    options,
    multiple
}: {
    options: Option[];
    multiple?: boolean;
}) {
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

type ComboboxBaseProps = {
    children: React.ReactNode;
    onClickAway: () => void;
}
export const ComboboxBase = React.forwardRef<HTMLDivElement, ComboboxBaseProps>(({ children, onClickAway }, ref) => {
    return (
        <ClickAwayListener onClickAway={onClickAway}>
            <div ref={ref} className='relative'>
                {children}
            </div>
        </ClickAwayListener>
    )
})
ComboboxBase.displayName = 'ComboboxBase'


type ComboboxTriggerProps = {
    children: React.ReactNode;
    className?: string;
}

export function ComboboxTrigger({ children, className }: ComboboxTriggerProps) {
    return (
        <div className={cn('flex items-center space-x-1 pl-1 border border-transparent', className)}>
            {children}
        </div>
    )
}

type ComboboxContentProps = {
    children: React.ReactNode;
    className?: string;
}

export function ComboboxContent({ children, className }: ComboboxContentProps) {
    return (
        <ul className={cn('absolute z-10 shadow-md bg-foreground border border-border mt-1 min-w-44 list-none', className)}>
            {children}
        </ul>
    )
}

type ComboboxItemProps = {
    children: React.ReactNode;
    onClick?: () => void;
}

export function ComboboxItem({ children, onClick }: ComboboxItemProps) {
    return (
        <li className='p-1 hover:bg-hover' onClick={onClick}>
            {children}
        </li>
    )
}