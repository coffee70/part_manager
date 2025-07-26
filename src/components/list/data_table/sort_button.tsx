import { ArrowBigUpIcon, ArrowBigDownIcon } from "lucide-react";
import { useState } from "react";

export default function SortButton() {
    const [arrowState, setArrowState] = useState<'up' | 'down' | 'none'>('none');

    const handleArrowClick = () => {
        setArrowState(prev => {
            if (prev === 'none') return 'up';
            if (prev === 'up') return 'down';
            return 'none';
        });
    };

    const getArrowIcon = () => {
        if (arrowState === 'up') {
            return <ArrowBigUpIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 fill-current" strokeWidth={1} />;
        }
        if (arrowState === 'down') {
            return <ArrowBigDownIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 fill-current" strokeWidth={1} />;
        }
        return <ArrowBigUpIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" strokeWidth={1} />;
    };

    return (
        <button 
            className="h-5 w-5 rounded hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center justify-center -mr-px"
            onClick={handleArrowClick}
        >
            {getArrowIcon()}
        </button>
    );
} 