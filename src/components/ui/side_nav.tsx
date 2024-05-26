import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon, CircleIcon } from "lucide-react"

type NavBaseProps = {
    children: React.ReactNode
    className?: string
}

function NavBase({ children, className }: NavBaseProps) {
    return (
        <div className={cn('flex flex-col items-center bg-foreground h-full w-64', className)}>
            {children}
        </div>
    )
}

type NavHeaderProps = {
    children: React.ReactNode
}

function NavHeader({ children }: NavHeaderProps) {
    return (
        <div className="w-full p-4">
            {children}
        </div>
    )
}

type NavContentProps = {
    children: React.ReactNode
}

function NavContent({ children }: NavContentProps) {
    return (
        <div className="flex flex-col space-y-1 mt-1 w-full">
            {children}
        </div>
    )
}

type NavFooterProps = {
    children: React.ReactNode
}

function NavFooter({ children }: NavFooterProps) {
    return (
        <div className="flex flex-col space-y-1 mb-2 mt-1 w-full">
            {children}
        </div>
    )
}

type NavItemProps = {
    label: string
    icon?: React.ReactNode
    open?: boolean
    onClick?: () => void
}

function NavItem({ label, icon, open, onClick }: NavItemProps) {
    return (
        <button className='flex items-center h-12 px-4 hover:bg-hover' onClick={onClick}>
            <div className='flex items-center space-x-6'>
                {icon}
                <span>{label}</span>
            </div>
            {open === true && <ChevronUpIcon className='ml-auto' />}
            {open === false && <ChevronDownIcon className='ml-auto' />}
        </button>
    )
}

type SubNavItemProps = {
    label: string
    top?: boolean
    bottom?: boolean
    onClick?: () => void
}

function SubNavItem({ label, top, bottom, onClick }: SubNavItemProps) {
    return (
        <button className="flex items-center space-x-6 h-10 px-4 text-accent-secondary hover:bg-hover" onClick={onClick}>
            <div className="flex flex-col items-center h-full w-6">
                <div className={cn("grow border", top ? "border-transparent" : "border-accent-foreground")} />
                <CircleIcon size={8} strokeWidth={3} />
                <div className={cn("grow border", bottom ? "border-transparent" : "border-accent-foreground")} />
            </div>
            <span>{label}</span>
        </button>   
    )
}

type NavDividerProps = {
    bottom?: boolean
}

function NavDivider({ bottom }: NavDividerProps) {
    return (
        <div className={cn("flex items-center w-full px-4", { "mt-auto": bottom })}>
            <div className="grow border-t border-hover" />
        </div>
    )
}

export {
    NavBase,
    NavHeader,
    NavContent,
    NavFooter,
    NavItem,
    SubNavItem,
    NavDivider,
}