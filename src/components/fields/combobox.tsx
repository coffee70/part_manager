'use client'
import { type Option, ComboboxBase, ComboboxTrigger, ComboboxContent, ComboboxItem, useCombobox } from "../ui/combobox"
import { ComboboxBadge } from "../ui/badge"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { CheckIcon, PencilIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
    options: Option[];
    multiple?: boolean;
}

export function Combobox({ options, multiple }: Props) {
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
            <ComboboxTrigger className={cn('group', open ? 'border-border' : 'hover:border-border')}>
                {multiple && selected.length > 0 && selected.map(option => (
                    <ComboboxBadge key={option.id} label={option.value} onClick={() => handleRemove(option)} />
                ))}
                <Input
                    ref={inputRef}
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
                        <ComboboxItem key={option.id} onClick={() => handleSelect(option)}>
                            <span>{option.value}</span>
                        </ComboboxItem>
                    ))}
                </ComboboxContent>
            )}
        </ComboboxBase>
    )
}