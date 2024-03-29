import React from "react";
import { Input, InputProps } from "@/components/ui/input";
import { CheckIcon } from "lucide-react";

interface FocusedProps extends InputProps {
    setFocused: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Focused(props: FocusedProps) {
    const { setFocused, ...other } = props;
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleEvent = React.useCallback((event: React.MouseEvent | React.KeyboardEvent) => {
        if ('key' in event && event.key !== 'Enter') {
            return;
        }
        setFocused(false);
    }, [setFocused]);

    {/** Focus on initial render */}
    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div className="flex items-center border border-border">
            <Input ref={inputRef} className="ml-1" {...other} onKeyDown={handleEvent} />
            <button
                className="bg-foreground p-1"
                onClick={handleEvent}
            >
                <CheckIcon />
            </button>
        </div>
    )
}