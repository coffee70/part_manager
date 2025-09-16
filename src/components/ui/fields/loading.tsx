import React from 'react';
import { LoaderCircleIcon } from 'lucide-react';

const Loading = React.forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div
            ref={ref}
            className='grow flex items-center p-1 bg-secondary'
            {...props}
        >
            <LoaderCircleIcon className="animate-spin" />
        </div>
    )
});

Loading.displayName = 'Loading';

export default Loading;