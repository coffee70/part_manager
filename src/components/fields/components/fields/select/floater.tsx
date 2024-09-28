import React from 'react';

const Floater = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, ...others }, ref) => {
    return (
        <div
            className='border border-foreground shadow-md w-full'
            ref={ref}
            {...others}
        >
            {children}
        </div>
    )
})

Floater.displayName = 'Floater';

export default Floater;