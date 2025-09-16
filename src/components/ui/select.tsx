import { cn } from "@/lib/utils";

type SelectBaseProps = {
    children: React.ReactNode;
}

function SelectBase({ children }: SelectBaseProps) {
    return (
        <ul
            className={cn(
                "relative overflow-auto rounded-lg min-w-56 p-1 bg-popover border border-subtle",
            )}
        >
            {children}
        </ul>
    )
}

type SelectItemProps = {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

function SelectItem({ children, onClick, className }: SelectItemProps) {
    return (
        <li
            className={cn(
                "flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors focus:bg-hover hover:bg-hover focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary",
                className,
            )}
            onClick={onClick}
        >
            {children}
        </li>
    )
}

export {
    SelectBase,
    SelectItem,
}