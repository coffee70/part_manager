import React from 'react'
import { Button, ButtonProps } from "@/components/ui/button"
import { ChevronDownIcon } from 'lucide-react';

type Props = ButtonProps & {
    action: string;
}

const ActionButton = React.forwardRef<HTMLButtonElement, Props>(({ action, ...props }, ref) => {
    return (
        <div className='flex bg-foreground rounded-sm'>
            <div className='px-2 py-1'>{action}</div>
            <div className='border-l border-muted-foreground'></div>
            <Button
                {...props}
                className='px-1 hover:bg-hover'
                ref={ref}
                variant='icon'
            >
                <ChevronDownIcon size={16} />
            </Button>
        </div>
    )
})

ActionButton.displayName = 'ActionButton'

export default ActionButton