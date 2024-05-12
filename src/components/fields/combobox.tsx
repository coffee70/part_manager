import { type Option, SelectBase, SelectTrigger, SelectContent, SelectItem, useCombobox, Badge } from "../ui/combobox"
import { ClickAwayListener } from "@mui/base"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { CheckIcon, PencilIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
    options: Option[];
    multiple?: boolean;
}

export function Select({ options, multiple }: Props) {
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
        <ClickAwayListener onClickAway={handleBlur}>
            <SelectBase>
                <SelectTrigger className={cn('group', open ? 'border-border' : 'hover:border-border')}>
                    {multiple && selected.length > 0 && selected.map(option => (
                        <Badge key={option.id} label={option.value} onClick={() => handleRemove(option)} />
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
                </SelectTrigger>
                {open && filteredOptions.length > 0 && (
                    <SelectContent>
                        {filteredOptions.map(option => (
                            <SelectItem key={option.id} onClick={() => handleSelect(option)}>
                                <span>{option.value}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                )}
            </SelectBase>
        </ClickAwayListener>
    )
}