import React from "react";
import { Input, InputProps } from "@/components/ui/input";
import { CheckIcon } from "lucide-react";
import { useFocusContext } from "@/components/summary/summary_details_context";
import { DetailT } from "@/components/summary/summary_details";

interface FocusedProps extends InputProps {
    detail: DetailT;
}

export default function Focused(props: FocusedProps) {
    const { detail, ...other } = props;
    const { focus, blur } = useFocusContext();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleEvent = React.useCallback((event: React.MouseEvent | React.KeyboardEvent) => {
        if ('key' in event && event.key !== 'Enter') {
            return;
        }
        blur(detail.id);
    }, [detail.id, blur]);

    {/** Focus on initial render */ }
    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div className="flex items-center border border-border w-full">
            <Input
                ref={inputRef}
                className="ml-1"
                onKeyDown={handleEvent}
                value={detail.value}
                {...other}
            />
            <button
                className="bg-foreground p-1"
                onClick={handleEvent}
            >
                <CheckIcon />
            </button>
        </div>
    )
}