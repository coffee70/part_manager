import React from 'react';
import { ComboboxBase, ComboboxContent, ComboboxItem, ComboboxTrigger } from "@/components/ui/combobox";
import { Input as BaseInput } from "@/components/ui/input";

export interface Option {
    label: string;
}

type ComboboxProps = {
    label: string;
    options: Option[];
    onChange: (option: Option) => void;
}

export default function Combobox({ label, options, onChange }: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleSelect = (option: Option) => {
        setSearch(option.label);
        onChange(option);
        setOpen(false);
    }

    const filteredOptions = options.filter(option => option.label.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="flex flex-col">
            <span>{label}</span>
            <ComboboxBase onClickAway={() => setOpen(false)}>
                <ComboboxTrigger className="border border-muted-foreground p-1">
                    <BaseInput value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setOpen(true)} ref={inputRef} />
                </ComboboxTrigger>
                {open && (
                    <ComboboxContent>
                        {filteredOptions.map(option => (
                            <ComboboxItem key={option.label} onClick={() => handleSelect(option)}>
                                {option.label}
                            </ComboboxItem>
                        ))}
                    </ComboboxContent>
                )}
            </ComboboxBase>
        </div>
    )
}