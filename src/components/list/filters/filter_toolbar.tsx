import Toggle from "../../ui/toggle";

type Props = {
    children: React.ReactNode;
    toggle?: {
        label: string;
    }
}

/**
 * FilterToolbar component
 * 
 * Example:
 * ```tsx
 * <FilterToolbar>
 *   <FilterToolbarRow>
 *     <DateFilter />
 *     <StatusFilter />
 *   </FilterToolbarRow>
 *   <FilterToolbarRow>
 *     <Toggle label="Show Completed" />
 *   </FilterToolbarRow>
 * </FilterToolbar>
 * ```
 */
export function FilterToolbar({ children, toggle }: Props) {
    return (
        <div className="flex flex-col space-y-2">
            {children}
        </div>
    )
}

export function FilterToolbarRow({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center space-x-2">
            {children}
        </div>
    )
}