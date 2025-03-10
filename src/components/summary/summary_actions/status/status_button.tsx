import React from "react"
import { ChevronDownIcon } from "lucide-react"
import StatusIndicator from "@/components/ui/status_indicator"
import { ButtonProps } from "@/components/ui/button"
import { Status } from "@/types/types"

type Props = {
    status: Status;
}

const StatusButton = React.forwardRef<HTMLDivElement, ButtonProps & Props>(({ status, ...props }, ref) => {
    return (
        <div ref={ref} className='flex rounded-sm border font-bold bg-foreground'>
            <div className='flex items-center space-x-2 px-2'>
                <StatusIndicator color={status.color} />
                <div className='py-1'>
                    <span>{status.label}</span>
                </div>
            </div>
            <div className='border-l'></div>
            <button
                {...props}
                className='px-1 hover:bg-hover rounded-r-sm rounded-l-none'
            >
                <ChevronDownIcon size={16} strokeWidth={3} />
            </button>
        </div>
    )
})

StatusButton.displayName = 'StatusButton'

export default StatusButton

