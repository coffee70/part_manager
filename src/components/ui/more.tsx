import React from 'react'
import { Button, ButtonProps } from './button'
import { MoreHorizontalIcon } from 'lucide-react'

const More = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
    <div className='flex items-center justify-center'>
        <Button
            {...props}
            ref={ref}
            variant="icon"
            className='bg-transparent'
            name="more"
        >
            <MoreHorizontalIcon />
        </Button>
    </div>
))
More.displayName = 'More'

export { More }