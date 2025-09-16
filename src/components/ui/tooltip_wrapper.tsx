import { cn } from "@/lib/utils";

export function TooltipWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("bg-background-contrast text-background-contrast-text text-xs px-2 py-1.5 rounded-md shadow-sm", className)}>
            {children}
        </div>
    )
}