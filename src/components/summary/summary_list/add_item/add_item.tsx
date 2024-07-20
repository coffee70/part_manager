'use client'
import { ClickAwayListener } from "@mui/base"
import Trigger from "./trigger"
import Combobox, { ComboboxOption } from "./combobox"
import { useEditContext } from "./edit_context"
import Input from "./input"

export type Props<Option> = {
    label: string;
    placeholder?: string;
} & ({
    value?: Option | null;
    onChange?: (event: React.SyntheticEvent<Element, Event>, newValue: Option | null) => void;
    options: Option[];
} | {
    value: React.InputHTMLAttributes<HTMLInputElement>['value'];
    onChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'];
    options: undefined;
})

export default function AddItem<Option extends ComboboxOption>({
    label,
    placeholder,
    value,
    onChange,
    options
}: Props<Option>) {
    const { isEditing, setIsEditing } = useEditContext();
    return !isEditing ? (
        <Trigger label={label} onClick={() => setIsEditing(true)} />
    ) : (
        <ClickAwayListener onClickAway={() => setIsEditing(false)}>
            {options ? (
                /** ClickAwayListener needs this div here to put a ref on it */
                <div>
                    <Combobox options={options ? options : []} value={value} onChange={onChange} placeholder={placeholder} />
                </div>
            ) : (
                <Input placeholder={placeholder} value={value} onChange={onChange} />
            )}
        </ClickAwayListener>
    )
}
