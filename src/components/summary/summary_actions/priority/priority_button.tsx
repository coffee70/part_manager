import React from "react";
import { Priority } from "@/types/types";
import { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";

type Props = {
    priority: Priority;
}

const PriorityButton = React.forwardRef<HTMLDivElement, ButtonProps & Props>(({ priority, ...props }, ref) => {
    return (
        <div ref={ref} className='flex rounded-sm border text-white font-bold' style={{ backgroundColor: priority.color }}>
            <div className='px-2 py-1 rounded-l-sm'>
                <span>{priority.label}</span>
            </div>
            <div className='border-l'></div>
            <Button
                {...props}
                className='px-1 hover:bg-hover rounded-r-sm'
                variant='icon'
            >
                <ChevronDownIcon size={16} strokeWidth={3} />
            </Button>
        </div>
    )
})

PriorityButton.displayName = 'PriorityButton'

export default PriorityButton