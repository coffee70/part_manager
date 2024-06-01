'use client'
import { type Option, ComboboxBase, ComboboxTrigger, ComboboxContent, ComboboxItem } from "../ui/combobox"
import { useCombobox } from "@/hooks/combobox/combobox.hook"
import { ComboboxBadge } from "../ui/badge"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { CheckIcon, PencilIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
    options: Option[];
    value: Option[];
    onChange: React.Dispatch<React.SetStateAction<Option[]>>;
    multiple?: boolean;
    placeholder?: string;
    creative?: boolean;
}

export function Combobox({ options, value, onChange, multiple, placeholder, creative }: Props) {
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