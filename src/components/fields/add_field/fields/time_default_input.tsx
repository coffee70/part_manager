import { useTimeInput } from "@/hooks/time_input.hook";
import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
    label: string;
    placeholder?: string;
    time: string;
    setTime: (time: string) => void;
}

export default function TimeInput({ label, placeholder, time, setTime }: Props) {
    const {
        inputRef,
        invalidTime,
        handleInput,
        handleFocus,
        handleBlur,
    } = useTimeInput({ time, setTime });

    return (
        <div>
            <span>{label}</span>
            <div className={cn('group flex items-center border border-transparent', invalidTime ? 'border-red-600' : 'border-muted-foreground')}>
                <BaseInput
                    className="p-1"
                    ref={inputRef}
                    placeholder={placeholder}
                    value={time}
                    onChange={(e) => handleInput(e)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>
        </div>
    )
}