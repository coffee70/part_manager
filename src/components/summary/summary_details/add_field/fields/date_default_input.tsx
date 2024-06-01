import { useDateInput } from "@/components/fields/date";
import { Calendar } from "@/components/ui/calendar";
import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ClickAwayListener } from "@mui/base";

type Props = {
    label: string;
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
}

export default function DateInput({ label, value, onChange }: Props) {
    const {
        open,
        input,
        setInput,
        inputRef,
        invalidDate,
        handleFocus,
        handleSet,
        handleBlur,
    } = useDateInput({ onChange });

    return (

        <div className="group relative">
            <span>{label}</span>
            <ClickAwayListener onClickAway={handleBlur}>
                <div className={cn('flex items-center border border-transparent', invalidDate ? 'border-red-600' : 'border-muted-foreground')}>
                    <BaseInput className="p-1" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onFocus={handleFocus} />
                </div>
            </ClickAwayListener>
            {open && (
                <div className="absolute z-10 shadow-md bg-foreground border border-border mt-1">
                    <Calendar mode='single' selected={value} onSelect={(e) => handleSet(e)} />
                </div>
            )}
        </div>

    )
}