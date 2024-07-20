'use client'
import React from 'react';
import { useAutocomplete } from '@mui/base';
import Input from './input';

export interface ComboboxOption {
    label: string;
}

type ComboboxProps<Option extends ComboboxOption> = {
    options: Option[];
    value?: Option | null;
    onChange?: (event: React.SyntheticEvent<Element, Event>, newValue: Option | null) => void;
    placeholder?: string;
    divRef?: React.Ref<HTMLDivElement>;
}

export default function Combobox<Option extends ComboboxOption>({ options, value, onChange, placeholder }: ComboboxProps<Option>) {
    const {
        getRootProps,
        getInputProps,
        getListboxProps,
        getOptionProps,
        popupOpen,
        groupedOptions,
    } = useAutocomplete({
        options,
        value,
        onChange,
        openOnFocus: true,
    });

    return (
        <div className='border-t border-foreground'>
            <div {...getRootProps()} className='relative'>
                <Input {...getInputProps()} placeholder={placeholder} />
                {popupOpen && groupedOptions.length > 0 && <div className='absolute z-10 bg-foreground w-full p-1 mt-2 border border-border'>
                    <ul {...getListboxProps()} className='space-y-1 '>
                        {(groupedOptions as Option[]).map((option, index) => (
                            <li {...getOptionProps({ option, index })} key={index}>{option.label}</li>
                        ))}
                    </ul>
                </div>}
            </div>
        </div>
    )
}