'use client'
import React from 'react';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useClick,
    useDismiss,
    useRole,
    useInteractions,
    useMergeRefs,
    FloatingFocusManager,
} from '@floating-ui/react';
import FieldBase, { useIsEditing } from '@/components/fields/components/fields/base';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { CheckIcon } from 'lucide-react';
import { ComboboxBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
    value: string | string[];
    onChange: (value: string | string[]) => void;
    options: string[];
    multiple?: boolean;
    creative?: boolean;
}

export default function Select(props: Props) {

    const {
        options,
        multiple,
        creative,
        value, 
        onChange,
        ...other
    } = props;

    const [open, setOpen] = React.useState(false);

    // the current text in the input component
    const [input, setInput] = React.useState("")

    const { isEditing, setIsEditing, inputRef } = useIsEditing()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpen(true);
        setInput(e.target.value);
    }

    const handleSet = (currentValue: string) => {
        if (multiple && Array.isArray(value)) {
            if (value.includes(currentValue)) {
                onChange(value.filter((v) => v !== currentValue))
            }
            else if (creative || options.some((option) => option === currentValue)) {
                onChange([...value, currentValue])
            }
            setInput("")
            inputRef.current?.focus()
        }
        else {
            if (creative || options.some((option) => option === currentValue)) {
                setInput(currentValue === value ? "" : currentValue)
                onChange(currentValue === value ? "" : currentValue)
            }
            setOpen(false)
        }
    }

    const handleRemove = (v: string) => {
        if (multiple && Array.isArray(value)) {
            onChange(value.filter((value) => value !== v))
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && multiple && Array.isArray(value) && value.length > 0 && input === "") {
            onChange(value.slice(0, value.length - 1))
        }

        if (e.key === "Enter") {
            e.preventDefault()
            if (creative) {
                handleSet(input)
            }
        }
    }

    const { refs, floatingStyles, context } = useFloating({
        open: open,
        onOpenChange: setOpen,
        middleware: [offset(10), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    // Merge all the interactions into prop getters
    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss,
        role,
    ]);

    const ref = useMergeRefs([refs.setReference, inputRef])

    return (
        <FieldBase
            ref={refs.setReference}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
        >
            <div className="flex items-center space-x-0.5 pr-1">
                {multiple && Array.isArray(value) && value.length > 0 && value.map((v) => (
                    <ComboboxBadge key={v} label={v} onRemove={() => handleRemove(v)} />
                ))}
            </div>
            <Input
                {...other}
                ref={ref}
                {...getReferenceProps()}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            {open && (
                <FloatingFocusManager context={context} modal={false} initialFocus={inputRef}>
                    <div
                        className='border border-foreground shadow-md w-full'
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}>
                        <Command>
                            <CommandList>
                                <CommandEmpty>No framework found.</CommandEmpty>
                                <CommandGroup>
                                    {options.filter((option) => option.includes(input)).map((option) => (
                                        <CommandItem
                                            key={option}
                                            value={option}
                                            onSelect={handleSet}
                                        >
                                            <CheckIcon
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === option ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {option}
                                        </CommandItem>
                                    ))}
                                    {creative && !options.some((option) => option.includes(input)) && (
                                        <CommandItem
                                            value={input}
                                            onSelect={handleSet}
                                        >
                                            <CheckIcon
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === input ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {input}
                                        </CommandItem>
                                    )}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </div>
                </FloatingFocusManager>
            )}
        </FieldBase>
    )
}