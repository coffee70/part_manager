import * as React from 'react';
import { PencilIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DetailT } from '@/components/summary/summary_details';
import { useFocusContext } from '@/components/summary/summary_details_context';

interface NotFocusedProps {
    detail: DetailT;
}

export default function NotFocused({ detail }: NotFocusedProps) {
    const [hovered, setHovered] = React.useState(false);
    const { focus } = useFocusContext();
    const handleMouseEnter = React.useCallback(() => setHovered(true), [setHovered]);
    const handleMouseLeave = React.useCallback(() => setHovered(false), [setHovered]);
    const handleClick = React.useCallback(() => focus(detail.id), [focus, detail.id]);

    return (
        <button className={cn(
            "flex items-center justify-end border border-transparent w-fit text-sm space-x-2",
            hovered ? "border-foreground" : ""
        )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <div
                className={cn(
                    "flex items-center justify-end space-x-2 p-1 border border-transparent",
                )}
            >{detail.value}</div>
            <div className={cn("p-1 bg-foreground", !hovered ? 'invisible disabled' : '')}>
                <PencilIcon />
            </div>
        </button>
    )
}