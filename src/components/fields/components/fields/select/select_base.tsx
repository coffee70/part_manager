'use client'
import React, { useImperativeHandle } from 'react';
import Badges from './badges';
import Floater from './floater';
import { FloatingFocusManager } from '@floating-ui/react';
import { ClickAwayListener } from '@mui/base';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelect } from './use_select.hook';

type Props = {
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
    options: string[];
    multiple?: boolean;
    creative?: boolean;
}

const SelectBase = React.forwardRef<HTMLInputElement | null, Props>((props, forwardedRef) => {

    const {
        options,
        multiple,
        creative,
        value,
        onChange,
        ...other
    } = props;

    const internalRef = React.useRef<HTMLInputElement>(null);

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(forwardedRef, () => internalRef.current);

    const {
        open,
        input,
        refs,
        floatingStyles,
        context,
        ref,
        getReferenceProps,
        getFloatingProps,
        handleInputChange,
        handleKeyDown,
        handleSet,
        handleRemove,
    } = useSelect({ inputRef: internalRef, ...props })

    return (
        <>
            <Badges
                value={value}
                multiple={multiple}
                handleRemove={handleRemove}
            />
            <Input
                {...other}
                ref={ref}
                {...getReferenceProps()}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            {open && (
                <FloatingFocusManager context={context} modal={false} initialFocus={internalRef}>
                    <Floater
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                    >
                        <Command>
                            <CommandList>
                                <CommandEmpty>No options found.</CommandEmpty>
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
                    </Floater>
                </FloatingFocusManager>
            )}
        </>
    )
})

SelectBase.displayName = 'SelectBase'

export default SelectBase;