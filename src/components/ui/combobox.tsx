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

export type Option = {
    id: number;
    value: string;
}

type Props = {
    options: Option[];
    multiple?: boolean;
}

export function useCombobox({ options, multiple }: Props) {
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
}
export const ComboboxBase = React.forwardRef<HTMLDivElement, ComboboxBaseProps>(({ children }, ref) => {
    return (
        <div ref={ref} className='relative'>
            {children}
        </div>
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
}

export function ComboboxContent({ children }: ComboboxContentProps) {
    return (
        <ul className='absolute z-10 shadow-md bg-foreground border border-border mt-1 min-w-44 list-none'>
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

type BadgeProps = {
    label: string;
    onClick: () => void;
}

export function Badge({ label, onClick }: BadgeProps) {
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