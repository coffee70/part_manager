'use client'
import React from 'react';
import { Option } from '@/components/ui/combobox';

export function useCombobox({
    options,
    onChange,
    multiple,
    creative,
}: {
    options: Option[];
    onChange: React.Dispatch<React.SetStateAction<Option[]>>;
    multiple?: boolean;
    creative?: boolean;
}) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    const findOption = (value: string): Option | undefined => {
        return options.find(o => o.value === value);
    }

    const handleMultipleSelection = (value: string, option: Option | undefined) => {
        onChange(prev => {
            const exists = prev.some(o => o.value === value);
            // if option is already selected, keep current selected
            if (exists) return prev;
            // if option is not selected and is an option, add it to selected
            if (option) return [...prev, option];
            // if option is not selected and is not an option and creative mode is on, add it to selected
            if (!option && creative) return [...prev, { value }];
            return prev;
        });
    }

    const handleSingleSelection = (value: string, option: Option | undefined) => {
        if (!option && creative) onChange([{ value }]);
        else if (option) onChange([option]);
    }

    const setSelected = ({ value }: Option) => {
        if (value === '') return;
        const option = findOption(value);
        if (!creative && !option) return;
        if (multiple) {
            handleMultipleSelection(value, option);
        } else {
            handleSingleSelection(value, option);
        }
    }

    const handleSelect = (option: Option) => {
        setSearch(multiple ? '' : option.value);
        setSelected(option);
    }

    const handleRemove = (option: Option) => {
        onChange(prev => prev.filter(o => o.value !== option.value))
    }

    const handleFocus = () => {
        inputRef.current?.focus();
        setOpen(true);
    }

    const handleBlur = () => {
        handleSelect({ value: search });
        inputRef.current?.blur();
        setOpen(false);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSelect({ value: search });
        }
        if (e.key === 'Backspace' && search === '') {
            onChange(prev => prev.slice(0, prev.length - 1))
        }
    }

    const filteredOptions = options.filter(option => option.value.toLowerCase().includes(search.toLowerCase()))

    return {
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
    }
}