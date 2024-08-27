/**
 * Combobox component: A select option input that contains a input search
 * to narrow down the options and a list of options to select from.
 * 
 * The component is composed of a ComboboxBase, ComboboxTrigger, ComboboxContent, and ComboboxItem.
 * These components make the building blocks of the combobox component.
 */
'use client'
import React from 'react'
import { cn } from '@/lib/utils';
import { ClickAwayListener } from '@mui/base';
import { Input } from './input';
import { ComboboxBadge } from './badge';
import { useCombobox } from '@/hooks/combobox.hook';
import { Button } from './button';
import { CheckIcon, PencilIcon } from 'lucide-react';

export interface Option {
    value: string;
}

type ComboboxProps = {
    options: Option[];
    value: Option[];
    onChange: React.Dispatch<React.SetStateAction<Option[]>>;
    multiple?: boolean;
    placeholder?: string;
    creative?: boolean;
}

/**
 * Internal combobox used throughout the application.
 */
export function Combobox({ options, value, onChange, multiple, placeholder, creative }: ComboboxProps) {
    const {
        open,
        search,
        setSearch,
        inputRef,
        filteredOptions,
        handleSelect,
        handleRemove,
        handleFocus,
        handleBlur,
        handleKeyDown,
    } = useCombobox({ options, onChange, multiple, creative })

    return (
        <ComboboxBase onClickAway={handleBlur}>
            <ComboboxTrigger className='border border-muted-foreground'>
                {multiple && value.length > 0 && value.map(option => (
                    <ComboboxBadge key={option.value} label={option.value} onRemove={() => handleRemove(option)} />
                ))}
                <Input
                    ref={inputRef}
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                />
            </ComboboxTrigger>
            {open && filteredOptions.length > 0 && (
                <ComboboxContent className='w-full'>
                    {filteredOptions.map(option => (
                        <ComboboxItem key={option.value} onClick={() => handleSelect(option)}>
                            {option.value}
                        </ComboboxItem>
                    ))}
                </ComboboxContent>
            )}
        </ComboboxBase>
    )
}

type StyledComboboxProps = {
    options: Option[];
    value: Option[];
    onChange: React.Dispatch<React.SetStateAction<Option[]>>;
    multiple?: boolean;
    placeholder?: string;
    creative?: boolean;
}

export function StyledCombobox({ options, value, onChange, multiple, placeholder, creative }: StyledComboboxProps) {
    const {
        open,
        search,
        setSearch,
        inputRef,
        filteredOptions,
        handleSelect,
        handleRemove,
        handleFocus,
        handleBlur,
    } = useCombobox({ options, onChange, multiple, creative })

    return (
        <ComboboxBase onClickAway={handleBlur}>
            <ComboboxTrigger className={cn('group', open ? 'border-border' : 'hover:border-border')}>
                {multiple && value.length > 0 && value.map(option => (
                    <ComboboxBadge key={option.value} label={option.value} onRemove={() => handleRemove(option)} />
                ))}
                <Input
                    ref={inputRef}
                    placeholder={placeholder}
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
            </ComboboxTrigger>
            {open && filteredOptions.length > 0 && (
                <ComboboxContent>
                    {filteredOptions.map(option => (
                        <ComboboxItem key={option.value} onClick={() => handleSelect(option)}>
                            <span>{option.value}</span>
                        </ComboboxItem>
                    ))}
                </ComboboxContent>
            )}
        </ComboboxBase>
    )
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
        <ul className={cn('absolute z-10 shadow-md bg-foreground border border-border mt-1 min-w-44 w-full list-none', className)}>
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