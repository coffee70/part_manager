'use client'
import React from 'react'
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
} from '@floating-ui/react';
import { useIsEditing } from '../is_editing.hook';

type Props = {
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    options: string[];
    multiple?: boolean;
    creative?: boolean;
}

export const useSelect = (props: Props) => {
    const {
        options,
        multiple,
        creative,
        value,
        inputRef,
        onChange,
    } = props;

    const [open, setOpen] = React.useState(false);

    // the current text in the input component
    const [input, setInput] = React.useState("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpen(true);
        setInput(e.target.value);
    }

    const handleSet = (currentValue: string) => {
        if (multiple && Array.isArray(value)) {
            if (value.includes(currentValue)) {
                onChange && onChange(value.filter((v) => v !== currentValue))
            }
            else if (creative || options.some((option) => option === currentValue)) {
                onChange && onChange([...value, currentValue])
            }
            setInput("")
            inputRef.current?.focus()
        }
        else {
            if (creative || options.some((option) => option === currentValue)) {
                setInput(currentValue === value ? "" : currentValue)
                onChange && onChange(currentValue === value ? "" : currentValue)
            }
            setOpen(false)
        }
    }

    const handleRemove = (v: string) => {
        if (multiple && Array.isArray(value)) {
            onChange && onChange(value.filter((value) => value !== v))
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && multiple && Array.isArray(value) && value.length > 0 && input === "") {
            onChange && onChange(value.slice(0, value.length - 1))
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

    return {
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
    }
}