import { FilterIcon } from "lucide-react";
import { forwardRef } from "react";

interface FilterButtonProps {
    active?: boolean;
}

const FilterButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & FilterButtonProps>(
    ({ active = false, ...props }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                className="h-5 w-5 p-0 rounded hover:scale-105 hover:bg-muted-secondary active:scale-95 transition-transform duration-150 flex items-center justify-center -ml-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 data-[state=open]:bg-muted-secondary data-[state=open]:scale-100"
                {...props}
            >
                <FilterIcon
                    className={`h-3 w-3 text-muted-foreground flex-shrink-0 ${active ? 'fill-current' : ''}`}
                    strokeWidth={1.5}
                />
            </button>
        );
    }
);

FilterButton.displayName = "FilterButton";

export default FilterButton; 